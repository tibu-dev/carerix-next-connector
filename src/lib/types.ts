interface CarerixContact {
	emailAddress: string;
}

export interface CarerixVacancy {
	id: string;
	content: {
		intro: string;
		company: string;
		vacancy: string;
		requirements: string;
		offer: string;
	};
	owner?: CarerixContact;
	title?: string;
	company?: {
		id: string;
		name: string;
	};
	startDate?: string;
	endDate?: string;
	modified?: string;
	hoursPerWeek?: number;
	salaryRange: {
		min: number;
		max: number;
		minFormatted: string;
		maxFormatted: string;
	};
}

export interface CarerixEmployee {
	firstName: string;
	lastName: string;
	emailAddress: string;
	mobileNumber: string;
	city: string;
}

export interface CarerixEmployeeApply extends CarerixEmployee {
	education: string;
	motivation: string;
	firstYearDiploma: boolean;
}

export interface GqlCarerixEmployee extends CarerixEmployee {
	_kind: 'CREmployee';
	notes: string;
}
