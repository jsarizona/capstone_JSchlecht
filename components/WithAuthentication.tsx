import {useAuth } from '../context/AuthContext';

const WithAuthentication = ({ children }: { children: any; }) => {
	const { authState } = useAuth();

	if (authState?.authenticated !== true) {
		return <></>;
	}

	return <>{children}</>;
};

export default WithAuthentication;