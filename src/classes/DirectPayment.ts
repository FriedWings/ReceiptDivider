import { payment } from './Payment';

export class directPayment extends payment {
	payee: string;

	constructor(payor: string, payorName: string, payee: string, description: string, amountDue: number, date: number, paid: boolean) {
		super(payor, payorName, description, 'directPayment', amountDue, date, paid);
		this.storedData['payee'] = payee;	
	}
}