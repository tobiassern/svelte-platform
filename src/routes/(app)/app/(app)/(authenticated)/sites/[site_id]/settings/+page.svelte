<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { Separator } from '$lib/components/ui/separator';
	import Input from '$lib/components/form-fields/input.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import GeneralInformationForm from './(components)/general-information-form.svelte';
	import DomainForm from './(components)/domain-form.svelte';
	import DeleteSiteForm from './(components)/delete-site-form.svelte';

	export let data;
</script>

<PageHeader.Root>
	<PageHeader.Title>Settings</PageHeader.Title>
</PageHeader.Root>
<Separator class="my-6" />
<div class="space-y-6 lg:max-w-2xl">
	<GeneralInformationForm sForm={data.general_information_form} />
	<DomainForm></DomainForm>
	<Separator class="my-6" />
	<DeleteSiteForm />
</div>
