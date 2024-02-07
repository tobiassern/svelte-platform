<script lang="ts">
	export let data;
</script>

<ul>
	{#each data.users as user}
		<li>
			{user.id}
			<form action="?/delete-user" method="POST">
				<button name="user_id" value="{user.id}" type="submit">Delete user</button>
			</form>
		</li>
	{/each}
</ul>
