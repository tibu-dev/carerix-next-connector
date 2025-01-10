# Carerix Next.js Connector

This package is created to have Next.js websites interact with Carerix. Any and all features included are currently undocumented.

> Force thou shall use - Reading source ain't abuse

![Force thou shall use - Reading source ain't abuse](https://cdn.mos.cms.futurecdn.net/nyU6UyNw4B4QVLj69n5hbe-1200-80.jpg)

## Set up

To set up the connection to Carerix you can simply use environment variables. It is however possible to provide/override the credentials onto each API method as an object in the last parameter.

```env
// Required
CARERIX_CLIENT_ID=
CARERIX_CLIENT_SECRET=
CARERIX_TOKEN_ENDPOINT=

// Optional (defaults shown)
CARERIX_GRAPHQL_URI=https://api.carerix.io/graphql/v1/graphql
CARERIX_MEDIUM_CODE=web
```

## Functions

The following methods are available:

### Get Vacancies

``` TS
const vacancy: Promise<CarerixVacancy | null> =
	await carerix.vacancy(
		vacancyId: number,
		connection?: Partial<CarerixConnection>
	);

const vacancies: Promise<CarerixVacancy[]> =
	await carerix.vacancies(
		connection?: Partial<CarerixConnection>
	);
```

### Employee Apply

```TS
const response: Promise<Boolean> =
	await carerix.employeeApply(
		vacancyId: number,
		data: CarerixEmployeeApply,
		connection?: Partial<CarerixConnection>
	);
```

## Contributing

See the CONTRIBUTE.md document
