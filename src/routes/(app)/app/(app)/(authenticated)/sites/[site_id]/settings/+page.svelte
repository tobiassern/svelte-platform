<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { Separator } from '$lib/components/ui/separator';
	import GeneralInformationForm from './(components)/general-information-form.svelte';
	import SubdomainForm from './(components)/subdomain-form.svelte';
	import DeleteSiteForm from './(components)/delete-site-form.svelte';
	import CoverImageForm from './(components)/cover-image-form.svelte';

	export let data;
</script>

<PageHeader.Root>
	<PageHeader.Title>Settings</PageHeader.Title>
</PageHeader.Root>
<Separator class="my-6" />
<div class="space-y-6 lg:max-w-2xl">
	<GeneralInformationForm sForm={data.general_information_form} />
	<CoverImageForm sForm={data.cover_image_form} />
	<SubdomainForm sForm={data.subdomain_form}></SubdomainForm>
	<Separator class="my-6" />
	<DeleteSiteForm />
</div>
