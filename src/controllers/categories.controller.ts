import { NextFunction, Request, Response } from 'express';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { Category } from '@interfaces/categories.interface';
import categoryService from '@services/categories.service';
import { config } from '@utils/config';

class CategoriesController {
  public categoryService = new categoryService();

  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCategoriesData: Category[] = await this.categoryService.findAllCategory();

      res.status(config.HTTP_SUCCESS).json({ data: findAllCategoriesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.id);
      const findOneCategoryData: Category = await this.categoryService.findCategoryById(categoryId);

      res.status(config.HTTP_SUCCESS).json({ data: findOneCategoryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: CreateCategoryDto = req.body;
      const createCategoryData: Category = await this.categoryService.createCategory(categoryData);

      res.status(config.HTTP_CREATED).json({ data: createCategoryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.id);
      const categoryData: CreateCategoryDto = req.body;
      const updateCategoryData: Category = await this.categoryService.updateCategory(categoryId, categoryData);

      res.status(config.HTTP_SUCCESS).json({ data: updateCategoryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.id);
      const deleteCategoryData: Category = await this.categoryService.deleteCategory(categoryId);

      res.status(config.HTTP_SUCCESS).json({ data: deleteCategoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
