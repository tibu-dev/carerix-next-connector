import { gql } from '@apollo/client';

const CARERIX_VACANCY_FIELDS = `
	_id

	toCompany {
		_id
		name
		visitCity
	}

	owner {
		emailAddress
	}

	toVacancy {
		titleInformation
		additionalInfo
		minSalary
		maxSalary
	}

	introInformation
	companyInformation
	vacancyInformation
	requirementsInformation
	offerInformation

	workLocation
	publicationStart
	publicationEnd

	modificationDate
`;

export const CARERIX_QUERY_VACANCIES = gql`
  query ($qualifier: String) {
    crPublicationPage(qualifier: $qualifier) {
      items {
        ${CARERIX_VACANCY_FIELDS}
      }
    }
  }
`;

export const CARERIX_QUERY_VACANCY = gql`
  query ($id: ID!) {
    crPublication(_id: $id) {
      ${CARERIX_VACANCY_FIELDS}
    }
  }
`;

export const CARERIX_MUTATION_EMPLOYEE_APPLY = gql`
	mutation ($publicationId: ID!, $data: CREmployeeRequest!) {
		crEmployeeApply(dedupe: false, pub: $publicationId, request: $data) {
			_id
		}
	}
`;
