interface CarerixContact {
	// TODO: Add these types again
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
	contact?: CarerixContact;
	title?: string;
	location?: string;
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
