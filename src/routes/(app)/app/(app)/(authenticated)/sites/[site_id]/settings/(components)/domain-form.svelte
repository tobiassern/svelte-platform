<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
</script>

<form method="POST" action="?/delete-site">
	<Card.Root>
		<Card.Header>
			<Card.Title>Site Domain</Card.Title>
			<Card.Description
				>Manage your public subdomain or use your own custom domain.</Card.Description
			>
		</Card.Header>
		<Card.Footer class="flex-col items-start">
			<Separator class="mb-6" />
			<Button type="submit">Update</Button></Card.Footer
		>
	</Card.Root>
</form>
