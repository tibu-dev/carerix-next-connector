import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';

export interface CarerixConnection {
	clientId: string;
	secret: string;
	tokenEndpoint: string;
	gqlUri: string;
	mediumCode: string;
}

const getCarerixConnectionData = (
	connection?: Partial<CarerixConnection>,
): CarerixConnection => {
	const {
		CARERIX_CLIENT_ID,
		CARERIX_CLIENT_SECRET,
		CARERIX_TOKEN_ENDPOINT,
		CARERIX_GRAPHQL_URI,
		CARERIX_MEDIUM_CODE,
	} = process.env;

	const data = Object.assign(
		{
			clientId: CARERIX_CLIENT_ID,
			secret: CARERIX_CLIENT_SECRET,
			tokenEndpoint: CARERIX_TOKEN_ENDPOINT,
			gqlUri:
				CARERIX_GRAPHQL_URI ??
				'https://api.carerix.io/graphql/v1/graphql',
			mediumCode: CARERIX_MEDIUM_CODE ?? 'web',
		},
		connection,
	);

	if (!data.clientId || !data.secret || !data.tokenEndpoint || !data.gqlUri) {
		throw new Error(
			'One or more required Carerix .env variables are missing. [CARERIX_CLIENT_ID, CARERIX_CLIENT_SECRET, CARERIX_TOKEN_ENDPOINT]',
		);
	}

	return data as CarerixConnection;
};

// Get Carerix oAuth
const getCarerixAuth = async (connection: CarerixConnection) => {
	const { tokenEndpoint, secret, clientId } = connection;

	const data = await fetch(tokenEndpoint, {
		method: 'POST',
		body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then((res) => res.json());

	return data;
};

// Helper function to extract the access token
const getCarerixToken = async (connection: CarerixConnection) => {
	const authData = await getCarerixAuth(connection);

	return authData.access_token;
};

const getApolloLinks = (connection: CarerixConnection, authToken: string) => {
	return from([
		new RetryLink({
			delay: {
				initial: 300,
				jitter: true,
			},
			attempts: {
				max: 3,
			},
		}),
		new HttpLink({
			uri: connection.gqlUri,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}),
	]);
};

// Set up the Apollo client for Carerix
export const getCarerixGqlClient = async (
	connection: Partial<CarerixConnection>,
) => {
	const connectData = getCarerixConnectionData(connection);

	const ctoken = await getCarerixToken(connectData);

	const client = new ApolloClient({
		link: getApolloLinks(connectData, ctoken),
		cache: new InMemoryCache(),
	});

	const options = {
		mediumCode: connectData.mediumCode,
	};

	return {
		client,
		options,
	};
};
