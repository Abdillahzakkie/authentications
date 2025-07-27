import { z as zod } from "zod";
import { CHAIN_ID } from "../../../constants";

const schema = zod.object({
	chainId: zod.coerce.number().optional().default(CHAIN_ID),
	account: zod.string(),
});

export default schema;
