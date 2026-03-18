import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BooksRoutingModule } from "./books-routing.module";
import { BookListComponent } from "./components/book-list/book-list.component";
import { BookFormComponent } from "./components/book-form/book-form.component";
import { BookDetailComponent } from "./components/book-detail/book-detail.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [BookListComponent, BookFormComponent, BookDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class BooksModule {}
