import { GqlCarerixVacancy } from "./gqlTypes";
import {
  CarerixEmployeeApply,
  CarerixVacancy,
  GqlCarerixEmployee,
} from "./types";
import { getCarerixGqlClient } from "./apiHelpers";
import {
  CARERIX_MUTATION_EMPLOYEE_APPLY,
  CARERIX_QUERY_VACANCIES,
  CARERIX_QUERY_VACANCY,
} from "./gqlQueries";
import moment from "moment";
import { parseCarerixVacancy } from "./helpers";

export const getCarerixVacancies = async () => {
  const dateFormat = "YYYY-MM-DD HH:mm:ss";
  const startDate = moment().endOf("day").format(dateFormat);
  const endDate = moment().startOf("day").add(1, "day").format(dateFormat);

  const carerix = await getCarerixGqlClient();
  const response = await carerix.query<{
    crPublicationPage: {
      items: GqlCarerixVacancy[];
    };
  }>({
    query: CARERIX_QUERY_VACANCIES,
    variables: {
      qualifier: `publicationStart <= (NSCalendarDate) '${startDate}' AND (publicationEnd > (NSCalendarDate) '${endDate}' OR publicationEnd = nil) AND toMedium.code = 'web'`,
    },
  });

  const items = response?.data?.crPublicationPage?.items;

  if (!items || !items.length) {
    return { data: null, errors: "No items returned from Carerix API" };
  }

  const parsedVacancies = await Promise.all(items.map(parseCarerixVacancy));

  return { data: parsedVacancies, errors: null };
};

export const getCarerixVacancy = async (
  vacancyId: number,
): Promise<CarerixVacancy | null> => {
  if (!vacancyId) {
    throw new Error("Cannot get Carerix vacancy without vacancyId");
  }

  let response;
  try {
    const carerix = await getCarerixGqlClient();
    response = await carerix.query<{ crPublication: GqlCarerixVacancy }>({
      query: CARERIX_QUERY_VACANCY,
      variables: {
        id: vacancyId,
      },
    });
  } catch (e) {}

  if (!response) {
    return null;
  }

  return await parseCarerixVacancy(response.data.crPublication);
};

export const setCarerixEmployeeApply = async (
  publicationId: string,
  employeeData: CarerixEmployeeApply,
): Promise<boolean> => {
  // NOTE: Format some fields to fit in the notes
  const notes = `Opleiding: \n${employeeData.education}\n\nMotivatie:\n${
    employeeData.motivation
  }\n\n${
    employeeData.firstYearDiploma ? "Heeft HBO/WO/MBO4" : "Niet gediplomeerd"
  }`;

  const data: GqlCarerixEmployee = {
    _kind: "CREmployee",
    firstName: employeeData.firstName,
    lastName: employeeData.lastName,
    emailAddress: employeeData.emailAddress,
    mobileNumber: employeeData.mobileNumber,
    city: employeeData.city,
    notes,
  };

  try {
    const carerix = await getCarerixGqlClient();
    await carerix.mutate({
      mutation: CARERIX_MUTATION_EMPLOYEE_APPLY,
      variables: {
        publicationId,
        data,
      },
    });
  } catch (e) {
    console.log(JSON.stringify(e, null, 4));
  }

  return true;
};
