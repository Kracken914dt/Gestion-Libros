import { Router } from 'express';
import { bookController } from './books.controller';
import { validate } from '../../middlewares/validator';
import {
  createBookValidation,
  updateBookValidation,
  getBooksValidation,
  bookIdValidation,
} from './books.validation';
import { authenticateToken, requireRole } from '../../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', validate(getBooksValidation), bookController.getBooks);

router.get('/search', bookController.searchBooks);

router.get('/:id', validate(bookIdValidation), bookController.getBookById);


router.post('/', requireRole('admin'), validate(createBookValidation), bookController.createBook);

router.put('/:id', requireRole('admin'), validate(updateBookValidation), bookController.updateBook);

router.delete('/:id', requireRole('admin'), validate(bookIdValidation), bookController.deleteBook);

export default router;
