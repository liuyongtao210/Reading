import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { HtmlPipe } from './htmlPipe';
import { FormatChatPipe } from './formatChat';
import { FormatDatePipe } from './formatDate';

@NgModule({
    declarations: [
        HtmlPipe,
        FormatChatPipe,
        FormatDatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HtmlPipe,
        FormatChatPipe,
        FormatDatePipe
    ]
})
export class PipesModule { }