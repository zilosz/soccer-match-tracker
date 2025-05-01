import { TrashCan } from "@carbon/icons-react";
import { Button } from "@carbon/react";

type MatchDeleteButtonProps = {
	matchId: number;
	handleMatchDelete: (id: number) => Promise<void>;
};

export default function MatchDeleteButton({ matchId, handleMatchDelete }: MatchDeleteButtonProps) {
	return (
		<>
			<Button
				kind="danger--ghost"
				renderIcon={TrashCan}
				hasIconOnly
				iconDescription="Delete"
				onClick={() => handleMatchDelete(matchId)}
			/>
		</>
	);
}
