import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { NotLifePremium } from '../../models';
@Component({
  selector: 'app-not-life-premium-file-checker',
  templateUrl: './not-life-premium-file-checker.component.html',
  styleUrls: ['./not-life-premium-file-checker.component.scss'],
})
export class NotLifePremiumFileCheckerComponent {
  rowPrefix = 'tr-';

  form: FormGroup | undefined;
  columns: (string | number)[] = [];
  columnKeys: (keyof NotLifePremium)[] = [];
  activeErrorRow = '';
  fileProcessingError = false;

  @ViewChild('table') table!: ElementRef<HTMLTableElement>;

  get controlNames() {
    return Object.keys(this.form?.controls || {}) || [];
  }

  get errorControls() {
    return this.controlNames.filter((name) => {
      return this.form?.get(name)?.invalid;
    });
  }

  constructor(private _fb: FormBuilder) {}

  getTableErrorControls(row: string) {
    return Object.keys((this.form?.get(row) as FormGroup).controls).filter(
      (key) => {
        return (this.form?.get(row) as FormGroup).get(key)?.invalid;
      }
    );
  }

  uploadFile(event: any) {
    this._clearConfigurations();
    this._processFile(event.target.files[0]);
  }

  nextStep() {
    this._clearConfigurations();
  }

  selectRow(rowId?: string) {
    if (!rowId) {
      this.activeErrorRow = '';
      return;
    }
    this.activeErrorRow = rowId;
    this.jumpToSelectedRiow();
  }

  jumpToSelectedRiow() {
    this.table.nativeElement.children[1].children
      .namedItem(this.rowPrefix + this.activeErrorRow)
      ?.scrollIntoView();
  }

  private _processFile(file: File) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      try {
        const arrayBuffer = fileReader.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        const arr = new Array();
        for (let i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const rowData = XLSX.utils
          .sheet_to_json(worksheet, { raw: true })
          .slice(5);
        const columns = Object.values(
          XLSX.utils
            .sheet_to_json(worksheet, { raw: true })
            .slice(4, 5)[0] as {}
        ) as (string | number)[];
        if (columns.length !== 15) {
          throw new Error();
        }

        rowData.forEach((row) => {
          const values = Object.values(row as any) as (string | number)[];
          const notLifePremiumRow: NotLifePremium = values.reduce(
            (acc, curr, index) => {
              (acc[('col' + (index + 1)) as keyof NotLifePremium] as
                | string
                | number) = curr;

              return acc;
            },
            {} as NotLifePremium
          );
          this._addControlToFormGroup(
            notLifePremiumRow.col1 + '',
            notLifePremiumRow
          );

          if (!this.columnKeys.length) {
            this.columnKeys = Object.keys(
              notLifePremiumRow
            ) as (keyof NotLifePremium)[];
          }
        });
      } catch (e) {
        this._clearConfigurations();
        this.fileProcessingError = true;
      }
    };

    fileReader.readAsArrayBuffer(file);
  }

  private _clearConfigurations() {
    this.form = undefined;
    this.fileProcessingError = false;
    this.columns = [];
    this.columnKeys = [];
    this.activeErrorRow = '';
  }

  private _buildRowFormGroup(input?: NotLifePremium) {
    const row = this._fb.group({
      col1: [
        { value: input?.col1 || 0, disabled: true },
        this._getValidatorsForNumberType(),
      ],
      col2: [input?.col2 || '', [Validators.required]],
      col3: [input?.col3 || '', [Validators.required]],
      col4: input?.col4 || '',
      col5: input?.col5 || '',
      col6: [input?.col6 || '', [Validators.required]],
      col7: [input?.col7 || '', [Validators.required]],
      col8: input?.col8 || '',
      col9: input?.col9 || '',
      col10: input?.col10 || '',
      col11: input?.col11 || '',
      col12: [input?.col12 || 0, this._getValidatorsForNumberType()],
      col13: [input?.col13 || 0, this._getValidatorsForNumberType()],
      col14: [input?.col14 || 0, this._getValidatorsForNumberType()],
      col15: [input?.col15 || 0, this._getValidatorsForNumberType()],
    });

    return row;
  }

  private _addControlToFormGroup(rowId: string, data?: NotLifePremium) {
    if (!this.form) this.form = this._fb.group({});
    this.form.addControl(rowId, this._buildRowFormGroup(data));
  }

  private _getValidatorsForNumberType() {
    return [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(1),
    ];
  }
}
