import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotLifePremiumFileCheckerComponent } from './components/not-life-premium-file-checker/not-life-premium-file-checker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [NotLifePremiumFileCheckerComponent],
  exports: [NotLifePremiumFileCheckerComponent],
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class SharedModule {}
