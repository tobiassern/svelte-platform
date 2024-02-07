<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import {
		addSortBy,
		addPagination,
		addTableFilter,
		addSelectedRows,
		addHiddenColumns
	} from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import Actions from './(components)/data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import DataTableCheckbox from './(components)/data-table-checkbox.svelte';
	import { ArrowUpDown, ChevronDown } from 'lucide-svelte';
	import Modal from '$lib/components/modal/modal.svelte';
	import { PUBLIC_HOST } from '$env/static/public';

	export let data;

	let { sites } = data;
	$: ({ sites } = data);

	const table = createTable(readable(sites), {
		sort: addSortBy({ disableMultiSort: true }),
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.includes(filterValue.toLowerCase())
		}),
		select: addSelectedRows(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.column({
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			accessor: 'id',
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Name',
			accessor: 'name',
			cell: ({ value }) => value,
			plugins: {
				filter: {
					getFilterValue(value) {
						return value.toLowerCase();
					}
				}
			}
		}),
		table.column({
			header: 'Domain',
			accessor: 'slug',
			cell: ({ value }) => `${value}.${PUBLIC_HOST}`,
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		}),
		table.column({
			header: '',
			accessor: ({ id }) => id,
			cell: (item) => {
				return createRender(Actions, { id: item.value.toString() });
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
		table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;

	const { hiddenColumnIds } = pluginStates.hide;
	const ids = flatColumns.map((c) => c.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;

	const { selectedDataIds } = pluginStates.select;

	const hideableCols = ['status', 'email', 'amount'];
</script>

<ul>
	{#each sites as site}
		<li>{site.name} {site.slug}</li>
	{:else}
		No sites found
	{/each}
</ul>
<form action="?/create-site" method="POST">
	<input name="name" type="text" />
	<input name="slug" type="text" />
	<button type="submit">Create site</button>
</form>
<div class="w-full">
	<div
		class="flex lg:items-center justify-stretch lg:justify-between py-4 gap-3 flex-col lg:flex-row"
	>
		<Input
			class="w-full lg:max-w-sm"
			placeholder="Filter emails..."
			type="text"
			bind:value={$filterValue}
		/>
		<div class="flex gap-3 justify-between lg:justify-end items-center w-full">
			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" class="ml-auto" builders={[builder]}>
							Columns <ChevronDown class="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						{#each flatColumns as col}
							{#if hideableCols.includes(col.id)}
								<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
									{col.header}
								</DropdownMenu.CheckboxItem>
							{/if}
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<div>
				<Modal></Modal>
			</div>
		</div>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
										{#if cell.id === 'amount'}
											<div class="text-right font-medium">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'email'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown
													class={cn(
														$sortKeys[0]?.id === cell.id && 'text-foreground',
														'ml-2 h-4 w-4'
													)}
												/>
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
										{#if cell.id === 'amount'}
											<div class="text-right font-medium">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'status'}
											<div class="capitalize">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
