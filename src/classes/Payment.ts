export class payment {
	storedData: object = {};

	constructor(payor: string, payorName: string, description: string, type: string, amountDue: number, date: number, paid: boolean){
		this.storedData['payor'] = payor;
		this.storedData['payorName'] = payorName;
		this.storedData['description'] = description;
		this.storedData['amountDue'] = amountDue;
		this.storedData['date'] = date;
		this.storedData['paid'] = paid;
		this.storedData['type'] = type;
	}

	getStoredData(){
		return this.storedData;
	}
}