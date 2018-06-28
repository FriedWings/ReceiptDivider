import { payment } from './Payment';

export class expenditure extends payment {
	constructor(payor: string, payorName: string, description: string, amountDue: number, date: number) {
		super(payor, payorName, description, 'expenditurePayment', amountDue, date, true);
	}
}