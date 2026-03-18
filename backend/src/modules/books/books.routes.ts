import { Router } from 'express';
import { bookController } from './books.controller';
import { validate } from '../../middlewares/validator';
import {
  createBookValidation,
  updateBookValidation,
  getBooksValidation,
  bookIdValidation,
} from './books.validation';

const router = Router();

router.get('/', validate(getBooksValidation), bookController.getBooks);

router.post('/', validate(createBookValidation), bookController.createBook);

router.get('/search', bookController.searchBooks);

router.get('/:id', validate(bookIdValidation), bookController.getBookById);

router.put('/:id', validate(updateBookValidation), bookController.updateBook);

router.delete('/:id', validate(bookIdValidation), bookController.deleteBook);

export default router;
