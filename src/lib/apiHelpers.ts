import { ApolloClient, InMemoryCache } from '@apollo/client';

// Get Carerix oAuth
const getCarerixAuth = async () => {
	// TODO: I don't think we can eat env vars like this..
	const {
		CARERIX_CLIENT_ID,
		CARERIX_CLIENT_SECRET,
		CARERIX_TOKEN_ENDPOINT,
		CARERIX_GRAPHQL_URI,
	} = process.env;

	if (
		!CARERIX_CLIENT_ID ||
		!CARERIX_CLIENT_SECRET ||
		!CARERIX_TOKEN_ENDPOINT ||
		!CARERIX_GRAPHQL_URI
	) {
		throw new Error(
			'One or more required Carerix .env variables are missing. [CARERIX_CLIENT_ID, CARERIX_CLIENT_SECRET, CARERIX_TOKEN_ENDPOINT, CARERIX_GRAPHQL_URI]',
		);
	}

	const data = await fetch(CARERIX_TOKEN_ENDPOINT!, {
		method: 'POST',
		body: `grant_type=client_credentials&client_id=${CARERIX_CLIENT_ID}&client_secret=${CARERIX_CLIENT_SECRET}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then((res) => res.json());

	return data;
};

// Helper function to extract the access token
const getCarerixToken = async () => {
	const authData = await getCarerixAuth();

	return authData.access_token;
};

// Set up the Apollo client for Carerix
export const getCarerixGqlClient = async () => {
	const ctoken = await getCarerixToken();

	return new ApolloClient({
		uri: process.env.CARERIX_GRAPHQL_URI,
		cache: new InMemoryCache(),
		headers: {
			Authorization: `Bearer ${ctoken}`,
		},
	});
};
