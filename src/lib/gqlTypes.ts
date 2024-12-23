export interface GqlCarerixVacancy {
	_id: string;
	toCompany: {
		_id: string;
	};
	owner: {
		emailAddress?: string;
	};
	toVacancy: {
		titleInformation?: string;
		additionalInfo?: any;
		minSalary?: number;
		maxSalary?: number;
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
