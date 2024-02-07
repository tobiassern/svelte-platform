<script lang="ts">
	export let data;
</script>

<ul>
	{#each data.sessions as session}
		<li>
			{session.id}
			<form action="?/delete-session" method="POST">
				<button name="session_id" value="{session.id}" type="submit">Delete session</button>
			</form>
		</li>
	{/each}
</ul>
