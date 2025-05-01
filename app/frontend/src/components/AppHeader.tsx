import { Content, Header, HeaderMenuItem, HeaderName, HeaderNavigation } from "@carbon/react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Matches from "./matches/Matches";
import Report from "./report/Report";

export default function AppHeader() {
	return (
		<>
			<Header aria-label="header">
				<HeaderName href="/" prefix="">
					<img className="icon" src="/soccer-ball.svg" aria-label="icon" />
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
					<Route path="/" element={<Navigate replace to="/matches" />} />
					<Route path="/matches" element={<Matches />} />
					<Route path="/report" element={<Report />} />
				</Routes>
			</Content>
		</>
	);
}
