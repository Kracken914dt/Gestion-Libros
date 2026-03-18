import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: string[] = [];
    errors.array().forEach((err) => {
      if (err.type === 'field') {
        extractedErrors.push(`${err.path}: ${err.msg}`);
      }
    });

    next(new AppError(400, `Validation failed: ${extractedErrors.join(', ')}`));
  };
};
