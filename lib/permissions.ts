import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    session: ["list", "revoke", "delete"],
});

export const admin = ac.newRole({
    ...adminAc.statements,
});

