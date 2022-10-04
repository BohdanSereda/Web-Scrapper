import { Markup } from 'telegraf';

export class ActionButtons {
    static renderButtons() {
        return Markup.keyboard(
            [
                Markup.button.callback('Cities', 'list'),
                Markup.button.callback('Restaurants', 'list'),
                Markup.button.callback('Working Hours', 'list'),
                Markup.button.callback('Reserve Table', 'edit'),
            ],
            {
                columns: 2,
            },
        );
    }
}
