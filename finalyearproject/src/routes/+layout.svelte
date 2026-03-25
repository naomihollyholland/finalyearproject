<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
    <a href="/">Homepage</a>
    <a href="/binary_tree">Binary tree</a>
	<a href="/binary_heap">Binary heap</a>
	<a href="/avl_tree">AVL tree</a>
	<a href="/red_black_tree">Red-Black tree</a>
	<a href="/fibonacci_heap">Fibonacci Heap</a>
</nav>


{@render children()}
