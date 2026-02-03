<script>
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';

	const homeHref = base || '/';

	const modeLabels = {
		focus: 'Focus',
		short: 'Short Break',
		long: 'Long Break'
	};

	let focusMinutes = 25;
	let shortBreakMinutes = 5;
	let longBreakMinutes = 15;
	let longBreakEvery = 4;

	let currentMode = 'focus';
	let secondsLeft = focusMinutes * 60;
	let isRunning = false;
	let cyclesCompleted = 0;
	let intervalId;

	const getDuration = (mode) => {
		if (mode === 'short') return shortBreakMinutes * 60;
		if (mode === 'long') return longBreakMinutes * 60;
		return focusMinutes * 60;
	};

	const stopInterval = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	const playAlert = () => {
		try {
			const context = new (window.AudioContext || window.webkitAudioContext)();
			const oscillator = context.createOscillator();
			const gain = context.createGain();

			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(880, context.currentTime);
			gain.gain.setValueAtTime(0.0001, context.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);

			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start();
			oscillator.stop(context.currentTime + 0.55);
			oscillator.onended = () => context.close();
		} catch (error) {
			// Ignore audio errors (autoplay restrictions, unsupported APIs).
		}

		if (navigator?.vibrate) {
			navigator.vibrate([120, 60, 160]);
		}
	};

	const tick = () => {
		if (secondsLeft <= 0) {
			advanceMode(true);
			return;
		}
		secondsLeft -= 1;
		if (secondsLeft === 0) {
			advanceMode(true);
		}
	};

	const startTimer = () => {
		if (isRunning) return;
		isRunning = true;
		stopInterval();
		intervalId = setInterval(tick, 1000);
	};

	const pauseTimer = () => {
		isRunning = false;
		stopInterval();
	};

	const resetTimer = () => {
		pauseTimer();
		secondsLeft = getDuration(currentMode);
	};

	const advanceMode = (notify = false) => {
		const interval = Math.max(1, Number(longBreakEvery) || 1);
		if (currentMode === 'focus') {
			cyclesCompleted += 1;
			currentMode = cyclesCompleted % interval === 0 ? 'long' : 'short';
		} else {
			currentMode = 'focus';
		}
		secondsLeft = getDuration(currentMode);
		if (notify) {
			playAlert();
		}
	};

	const switchMode = (mode) => {
		currentMode = mode;
		resetTimer();
	};

	const syncDurationIfIdle = () => {
		if (!isRunning) {
			secondsLeft = getDuration(currentMode);
		}
	};

	const formatTime = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	$: totalSeconds = getDuration(currentMode);
	$: progress = totalSeconds ? (1 - secondsLeft / totalSeconds) * 100 : 0;
	$: timeLabel = formatTime(secondsLeft);
	$: longBreakInterval = Math.max(1, Number(longBreakEvery) || 1);

	onDestroy(() => {
		stopInterval();
	});
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-300 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Pomodoro</h1>
			<p class="text-sm text-[var(--color-muted)]">Focus cycles that stay local in your browser.</p>
		</header>

		<section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
			<div class="panel space-y-6 p-6">
				<div class="flex flex-wrap items-center gap-2">
					{#each Object.entries(modeLabels) as [mode, label] (mode)}
						<button
							type="button"
							class="mode-button"
							data-active={currentMode === mode}
							on:click={() => switchMode(mode)}
						>
							{label}
						</button>
					{/each}
				</div>

				<div class="panel panel-muted space-y-4 p-6 text-center">
					<p class="text-xs tracking-[0.28em] text-[var(--color-muted)] uppercase">Now</p>
					<p class="text-5xl font-semibold sm:text-6xl">{timeLabel}</p>
					<p class="text-xs text-[var(--color-muted)]">
						Cycle {cyclesCompleted + 1} - {modeLabels[currentMode]}
					</p>
					<div class="progress-track">
						<div
							class="progress-fill"
							style={`width: ${Math.min(100, Math.max(0, progress))}%`}
						></div>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					<button
						type="button"
						class="action-button"
						on:click={isRunning ? pauseTimer : startTimer}
					>
						{isRunning ? 'Pause' : 'Start'}
					</button>
					<button type="button" class="ghost-button" on:click={resetTimer}>Reset</button>
					<span class="text-xs text-[var(--color-muted)]">
						Auto long break every {longBreakInterval} focus sessions
					</span>
				</div>
			</div>

			<div class="panel space-y-5 p-6">
				<div>
					<h2 class="text-lg font-semibold">Session Settings</h2>
					<p class="text-sm text-[var(--color-muted)]">Adjust durations in minutes.</p>
				</div>
				<div class="grid gap-4">
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Focus duration</span>
						<input
							type="number"
							min="5"
							max="90"
							step="1"
							class="search-input"
							bind:value={focusMinutes}
							on:change={syncDurationIfIdle}
						/>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Short break</span>
						<input
							type="number"
							min="3"
							max="30"
							step="1"
							class="search-input"
							bind:value={shortBreakMinutes}
							on:change={syncDurationIfIdle}
						/>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Long break</span>
						<input
							type="number"
							min="10"
							max="60"
							step="1"
							class="search-input"
							bind:value={longBreakMinutes}
							on:change={syncDurationIfIdle}
						/>
					</label>
					<label class="space-y-2 text-sm">
						<span class="text-[var(--color-muted)]">Long break frequency</span>
						<input
							type="number"
							min="2"
							max="8"
							step="1"
							class="search-input"
							bind:value={longBreakEvery}
							on:change={syncDurationIfIdle}
						/>
					</label>
				</div>
				<div class="rounded-xl border border-[var(--color-border)] bg-[rgba(10,14,20,0.6)] p-4">
					<p class="text-xs text-[var(--color-muted)]">
						Timer state is stored locally in memory and resets on refresh.
					</p>
				</div>
			</div>
		</section>
	</div>
</div>
