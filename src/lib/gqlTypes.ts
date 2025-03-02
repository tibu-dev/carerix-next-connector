export interface GqlCarerixVacancy {
	_id: string;

	toCompany: {
		_id: string;
		name: string;
		visitCity: string;
	};

	owner: {
		emailAddress: string;
	};

	toVacancy: {
		titleInformation?: string;
		additionalInfo?: any;
		minSalary?: number;
		maxSalary?: number;
		agency: {
			name: string;
		};
	};

	introInformation?: string;
	companyInformation?: string;
	vacancyInformation?: string;
	requirementsInformation?: string;
	offerInformation?: string;

	workLocation?: string;
	publicationStart?: string;
	publicationEnd?: string;

	modificationDate?: string;
}
