import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

interface NovaPoshtaErrorResponse {
  message?: string;
  errors?: string[];
}

export const getBranches = async (_req: Request, res: Response) => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {},
    });
    console.log('Nova Poshta response:', response.data);
    if (response.data.success) {
      res.json(response.data.data);
    } else {
      res.status(500).json({
        message: 'Nova Poshta API error',
        errors: response.data.errors,
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError<NovaPoshtaErrorResponse>;
    console.error('Error fetching Nova Poshta branches:', axiosError);
    res.status(500).json({
      message: 'Error fetching Nova Poshta branches',
      error: axiosError.message,
    });
  }
};
