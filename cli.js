import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { searchKeyword, displaySearchHistory } from './app.js';

// Parse command-line arguments
yargs(hideBin(process.argv))
    // Search command
    .command(
        'search <keyword>',
        'Search based on a keyword',
        (yargs) => {
            yargs.options({
                'cache': {
                    alias: 'c',
                    describe: 'Return cached results when available',
                    type: 'boolean',
                    default: false,
                },
            });
        },
        async (argv) => {
            const { keyword } = argv;
            await searchKeyword(keyword);
        }
    )
    // History command
    .command(
        'history',
        'Get history on previous searches', () => {
            displaySearchHistory();
        }
    )
    // Show help if no command provided
    .demandCommand(1, 'Please provide a valid command')
    .help()
    .alias('help', 'h')
    .argv;


