import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import type { PgColumn, PgDatabase, PgTableWithColumns } from 'drizzle-orm/pg-core';
export declare class CustomAdapter implements Adapter {
	private db;
	private sessionTable;
	private userTable;
	constructor(
		db: PgDatabase<any, any>,
		sessionTable: PostgreSQLSessionTable,
		userTable: PostgreSQLUserTable
		//systemAdminTable: PostgreSQLSystemAdminTable
	);
	deleteSession(sessionId: string): Promise<void>;
	deleteUserSessions(userId: string): Promise<void>;
	getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]>;
	getUserSessions(userId: string): Promise<DatabaseSession[]>;
	setSession(session: DatabaseSession): Promise<void>;
	updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void>;
	deleteExpiredSessions(): Promise<void>;
}
export type PostgreSQLUserTable = PgTableWithColumns<{
	dialect: 'pg';
	columns: {
		id: PgColumn<
			{
				name: any;
				tableName: any;
				dataType: any;
				columnType: any;
				data: string;
				driverParam: any;
				notNull: true;
				hasDefault: boolean;
				enumValues: any;
				baseColumn: any;
			},
			object
		>;
	};
	schema: any;
	name: any;
}>;
export type PostgreSQLSessionTable = PgTableWithColumns<{
	dialect: 'pg';
	columns: {
		id: PgColumn<
			{
				dataType: any;
				notNull: true;
				enumValues: any;
				tableName: any;
				columnType: any;
				data: string;
				driverParam: any;
				hasDefault: false;
				name: any;
			},
			object
		>;
		expiresAt: PgColumn<
			{
				dataType: any;
				notNull: true;
				enumValues: any;
				tableName: any;
				columnType: any;
				data: Date;
				driverParam: any;
				hasDefault: false;
				name: any;
			},
			object
		>;
		userId: PgColumn<
			{
				dataType: any;
				notNull: true;
				enumValues: any;
				tableName: any;
				columnType: any;
				data: string;
				driverParam: any;
				hasDefault: false;
				name: any;
			},
			object
		>;
	};
	schema: any;
	name: any;
}>;

// export type PostgreSQLSystemAdminTable = PgTableWithColumns<{
//     dialect: "pg";
//     columns: {
//         userId: PgColumn<{
//             name: any;
//             tableName: any;
//             dataType: any;
//             columnType: any;
//             data: string;
//             driverParam: any;
//             notNull: true;
//             hasDefault: boolean;
//             enumValues: any;
//             baseColumn: any;
//         }, object>;
//     };
//     schema: any;
//     name: any;
// }>;
