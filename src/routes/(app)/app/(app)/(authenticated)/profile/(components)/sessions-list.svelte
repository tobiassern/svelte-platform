<script lang="ts">
	import { sessions_table } from '$lib/schemas/db/schema';
	import * as Card from '$lib/components/ui/card';
	import { Trash2Icon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance } from '$app/forms';
	import { flip } from 'svelte/animate';

	type Session = typeof sessions_table.$inferSelect;

	export let sessions: Session[];
	export let currentSession: import('lucia').Session | null;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Your sessions</Card.Title>
		<Card.Description
			>This is a list of all current active sessions for your account.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<ul class="flex flex-col space-y-0.5">
			{#each sessions as session (session.id)}
				<li class="-mx-3 flex items-center justify-between gap-x-3 rounded p-3" animate:flip>
					<div>
						<p class="text-sm">Expires: {new Date(session.expiresAt).toLocaleString()}</p>
						<p class="text-sm">ID: {session.id}</p>
					</div>
					{#if currentSession?.id === session.id}
						<Badge variant="outline">Current session</Badge>
					{:else}
						<form method="POST" action="?/delete-session" use:enhance>
							<Button
								variant="outline"
								size="icon"
								type="submit"
								name="session_id"
								value={session.id}
							>
								<Trash2Icon class="h-4 w-4" />
							</Button>
						</form>
					{/if}
				</li>
			{/each}
		</ul>
	</Card.Content>
</Card.Root>
