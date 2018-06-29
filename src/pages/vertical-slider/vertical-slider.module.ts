import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerticalSliderPage } from './vertical-slider';

@NgModule({
  declarations: [
    VerticalSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(VerticalSliderPage),
  ],
})
export class VerticalSliderPageModule {}
