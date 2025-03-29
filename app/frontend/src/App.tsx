import {
	Content,
	Header,
	HeaderContainer,
	HeaderMenuItem,
	HeaderName,
	HeaderNavigation,
	Theme,
} from "@carbon/react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Matches from "./components/Matches";
import Report from "./components/Report";

const App: React.FC = () => {
	return (
		<>
			<Theme theme="g90">
				<HeaderContainer
					render={() => (
						<>
							<Header aria-label="header">
								<HeaderName href="/" prefix="">
									<img
										className="icon"
										src="/soccer-ball.svg"
										aria-label="icon"
									/>
									Soccer Match Tracker
								</HeaderName>
								<HeaderNavigation aria-label="header-nav">
									<HeaderMenuItem as={Link} to={"/matches"}>
										Matches
									</HeaderMenuItem>
									<HeaderMenuItem as={Link} to={"/report"}>
										Report
									</HeaderMenuItem>
								</HeaderNavigation>
							</Header>
							<Content>
								<Routes>
									<Route
										path="/"
										element={<Navigate replace to="/matches" />}
									/>
									<Route path="/matches" element={<Matches />} />
									<Route path="/report" element={<Report />} />
								</Routes>
							</Content>
						</>
					)}
				/>
			</Theme>
			<ToastContainer limit={1} />
		</>
	);
};

export default App;
