export class Order {
  constructor() {}
  dishId: string;
  dishType: string;
  dishCategory: string;
  dishName: string;
  dishImage: string;
  count: number;
  totalPrice: number;
}

export class FinalOrder {
  constructor() {}
  orderId: string;
  Orders: Order[];
  seatNumber: string;
  cookingInstructions: string;
  totalAmount: number;
  status: string;
  paymentMode: string;
  cardNumber: string;
  cardHolderName: string;
  cvv: number;
  paymentStatus: string;
}
