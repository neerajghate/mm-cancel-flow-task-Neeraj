// Simple local database backed by localStorage in the browser
// and an in-memory object on the server. This is for demo/testing only.

export type LocalDbShape = {
	users: Array<{ id: string; email: string; created_at: string }>;
	subscriptions: Array<{
		id: string;
		user_id: string;
		monthly_price: number;
		status: 'active' | 'pending_cancellation' | 'cancelled';
		created_at: string;
		updated_at: string;
	}>;
	cancellations: Array<{
		id: string;
		user_id: string;
		subscription_id: string;
		downsell_variant: 'A' | 'B';
		reason?: string;
		accepted_downsell: boolean;
		created_at: string;
	}>;
};

const DEFAULT_DB: LocalDbShape = {
	users: [
		{ id: '550e8400-e29b-41d4-a716-446655440001', email: 'user1@example.com', created_at: new Date().toISOString() },
		{ id: '550e8400-e29b-41d4-a716-446655440002', email: 'user2@example.com', created_at: new Date().toISOString() },
		{ id: '550e8400-e29b-41d4-a716-446655440003', email: 'user3@example.com', created_at: new Date().toISOString() }
	],
	subscriptions: [
		{ id: 'sub_1', user_id: '550e8400-e29b-41d4-a716-446655440001', monthly_price: 25, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
		{ id: 'sub_2', user_id: '550e8400-e29b-41d4-a716-446655440002', monthly_price: 29, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
		{ id: 'sub_3', user_id: '550e8400-e29b-41d4-a716-446655440003', monthly_price: 25, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
	],
	cancellations: []
};

const MEMORY_KEY = '__LOCAL_DB__';
const STORAGE_KEY = 'mm_local_db';

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export class LocalDb {
	static read(): LocalDbShape {
		if (isBrowser()) {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (!raw) {
					window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
					return structuredClone(DEFAULT_DB);
				}
				return JSON.parse(raw) as LocalDbShape;
			} catch {
				return structuredClone(DEFAULT_DB);
			}
		}

		// Server fallback: store on globalThis
		const g = globalThis as unknown as { [MEMORY_KEY]?: LocalDbShape } & Record<string, unknown>;
		if (!g[MEMORY_KEY]) {
			g[MEMORY_KEY] = structuredClone(DEFAULT_DB);
		}
		return g[MEMORY_KEY] as LocalDbShape;
	}

	static write(db: LocalDbShape): void {
		if (isBrowser()) {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
			return;
		}
		const g = globalThis as unknown as { [MEMORY_KEY]?: LocalDbShape } & Record<string, unknown>;
		g[MEMORY_KEY] = db;
	}

	static reset(): void {
		this.write(structuredClone(DEFAULT_DB));
	}

	static uuid(): string {
		// Simple UUID v4-ish generator for demo only
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
}


