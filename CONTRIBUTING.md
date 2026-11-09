# Contributing

Thanks for helping make the activity clearer and easier to teach. Useful contributions include corrections, accessibility improvements, translations, classroom adaptations, and tests of the existing model behavior.

## Share feedback

Open a bug report or teaching feedback issue. Include the phase, what you expected, what happened, and browser details when relevant. Use fictional examples. Do not include student names, photos, private codes, or other personal information. For a security issue, use SECURITY.md instead of a public issue.

## Propose a change

1. Open an issue for a substantial lesson or model change so we can discuss its teaching purpose.
2. Fork the repository and make a focused branch.
3. Keep the demo self-contained, offline, and free of analytics, accounts, remote assets, and package dependencies.
4. Keep the guide, printable materials, model rules, and answer key consistent. Explain any changes to expected outcomes.
5. Run `node --test tests/*.test.mjs` with Node.js 22 or later.
6. Rehearse the browser flow below. Include screenshots for visual changes, using only fictional inputs.
7. Submit a pull request explaining the problem, change, and checks completed.

Contributions are shared under the repository's existing CC BY-NC 4.0 license. Only contribute material you have permission to share. Be respectful and follow CODE_OF_CONDUCT.md.

## Browser rehearsal

Open `activity.html` directly from disk with the browser offline. Check a desktop viewport and a narrow phone viewport. With keyboard only, use Tab and Shift+Tab to reach each control, Enter or Space to activate buttons, and check that focus is visible and no keyboard trap occurs.

Train the model, reveal all six test messages, retrain, reveal all four fresh messages, and enter a fictional red-team message. Check empty and over-24-word inputs, show the trusted policy, and reveal the final passphrase example. Use Previous phase and Reset activity. Expected counts are 6/6 training, 2/6 initial test, and 4/4 fresh check; the final model predicts LEGIT for the passphrase request while the policy identifies SCAM. Confirm no network requests or storage writes and no horizontal overflow. Do not enter real information.

The current demo has visible focus styles, labeled controls, and a responsive single-column layout. This is not a formal accessibility conformance claim; improvements, particularly screen-reader phase and focus announcements, are welcome.

## Release checklist for maintainers

- Keep the four teaching files and START-HERE.txt together in a folder named `you-trained-it-now-beat-it-kit` when packaging the teaching ZIP.
- Update the version, changelog, citation date, and download URLs together.
- Run the automated checks and browser rehearsal, then attach the ZIP and its SHA-256 checksum to a tagged GitHub release.
- In the Website repository, copy the released `activity.html` to `public/activities/you-trained-it-now-beat-it/activity.html` and the released ZIP to `public/files/you-trained-it-now-beat-it-kit.zip`. Keep the HTML byte-identical to the file in the teaching ZIP.
- Update `src/lib/classroom-activity.ts` and any displayed file size or version, then run the Website tests, lint, typecheck, and build. Its activity page is `/blog/wakefield-ai-machine-learning-cybersecurity/activity`.
- Verify the release, website demo, and downloaded kit match. Publish website updates through the Website pull request workflow.

The PDF originals are included alongside the editable facilitator guide. There is currently no automated PDF source or regeneration pipeline. Any PDF edit must be checked against the guide and activity before release; do not imply that editing the Markdown regenerates the PDFs.
