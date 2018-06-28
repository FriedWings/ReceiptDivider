import { payment } from './Payment';

export class receipt extends payment {
	participants: string[];
	asd: {
		userId: string,
		userName: string,
		amountDue: number
	}[]

	constructor(payor: string, payorName: string, participants: string[], description: string, amountDue: number, date: number, paid: boolean) {
		super(payor, payorName, description, 'receiptPayment',amountDue, date, paid);
		this.storedData["participants"] = participants;
	}
}