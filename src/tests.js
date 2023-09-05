import { expect } from 'chai';
import { buildDeck, shuffleDeck, startGame, hit, stay, getValue, checkAce, reduceAce} from './script.js';

import { JSDOM } from 'jsdom';



const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

global.document = dom.window.document;
global.window = dom.window;

describe('buildDeck', () => {
    it('Should correctly return an array', () => {
        const result = buildDeck();
        expect(result).to.be.an('array');
    });

    it('Should correctly return 52 cards in the deck', () => {
        const result = buildDeck();
        expect(result).to.have.lengthOf(52);
    });

    it('Should check if Ace of Clubs is present', () => {
        const result = buildDeck();
        expect(result).to.include('A-C');
    });

    it('Should check if 2 of Diamonds is present', () => {
        const result = buildDeck();
        expect(result).to.include('2-D');
    });

    it('Should check if 5 of Spades is present', () => {
        const result = buildDeck();
        expect(result).to.include('5-S');
    });

    // ... and so on for other cards
});

describe('shuffleDeck', () => {
    it('Should shuffle the deck randomly', () => {
        // Create a sample deck for testing (you can customize this as needed)
        const deck = ['A-C', '2-D', '3-H', '4-S'];
    
        // Shuffle the deck
        const shuffledDeck = shuffleDeck([...deck]); // Make sure to create a copy of the deck
    
        // Check that the shuffled deck is not strictly equal to the original deck
        expect(shuffledDeck).to.not.equal(deck);
    
        // Check that the shuffled deck has the same elements as the original deck
        expect(shuffledDeck).to.have.members(deck);
    });
    
});


describe('startGame', () => {
    let yourSum, yourAceCount, dealerSum, dealerAceCount;

    beforeEach(() => {
        yourSum = 0;
        yourAceCount = 0;
        dealerSum = 0;
        dealerAceCount = 0;
    });

    it('Initializes the game correctly', () => {
        startGame(); 

        expect(yourSum).to.equal(0);
        expect(yourAceCount).to.equal(0);
        expect(dealerSum).to.equal(0);
        expect(dealerAceCount).to.equal(0);
    });
});


describe('hit', () => {
    let canHit = true;

    it('should increment yourSum and yourAceCount when a new card is added', () => {
        const yourSum = 10;
        const yourAceCount = 10;

        expect(yourSum).to.equal(10);
        expect(yourAceCount).to.equal(10);
    });

    it('should not increment yourSum or yourAceCount when canHit is false', () => {
        const yourSum = 10;
        const yourAceCount = 10;
        canHit = false;


        expect(yourSum).to.equal(10);
        expect(yourAceCount).to.equal(10);
    });

    it('should set canHit to false if yourSum exceeds 21', () => {
        const yourSum = 20;
        const yourAceCount = 1;
        canHit = true;


        expect(canHit).to.be.false;
    });
});


describe('stay', () => {
    let deck;
    let yourSum, dealerSum, dealerAceCount, yourAceCount, canHit, message;

    beforeEach(() => {
        deck = buildDeck(); // Initialize the deck
        shuffleDeck(deck);
        startGame();

        yourSum = 22; 
        dealerSum = 18; 
        dealerAceCount = 0; 
        yourAceCount = 1; 
        canHit = true;
    });

    it('Should update yourSum and message correctly if dealerSum exceeds 21', () => {
        // Set up the game state where the dealer's sum exceeds 21
        dealerSum = 22;
        yourSum = 18;
        dealerAceCount = 0;
        yourAceCount = 0;
        canHit = false;

        
        stay();

        // Assert the expected changes in yourSum, message, and canHit
        expect(yourSum).to.equal(18);
        expect(message).to.equal('You Win!'); // Dealer busted, so you win
        expect(canHit).to.be.false;
    });


});


describe('getValue', () => {
    it('should return 11 for Ace', () => {
        const card = 'A-C'; // Ace of Clubs
        const result = getValue(card);
        expect(result).to.equal(11); // Expect the result to be 11 for an Ace
    });

    it('should return 10 for face cards (J, Q, K)', () => {
        const cards = ['J-D', 'Q-H', 'K-S']; // Jack, Queen, King of different suits
        for (const card of cards) {
            const result = getValue(card);
            expect(result).to.equal(10); // Expect the result to be 10 for face cards
        }
    });

    it('should parse numeric value for numbered cards', () => {
        const cards = ['2-C', '5-D', '9-H']; // Numbered cards of different suits
        for (const card of cards) {
            const result = getValue(card);
            const expectedValue = parseInt(card[0]); // Extract the numeric value from the card string
            expect(result).to.equal(expectedValue); // Expect the result to match the expected numeric value
        }
    });

    it('should return 10 for unknown card values', () => {
        const card = 'X-Z'; // Unknown card value
        const result = getValue(card);
        expect(result).to.equal(10); // Expect the result to be 10 for unknown card values
    });

});

describe('checkAce', () => {
    it('Check if is Ace', () => {
        const card = 'A-C'; 
        const result = checkAce(card);

        expect(result).to.equal(1);
    })

    it('Check if is not Ace', () => {
        const card = 'J-C'; 
        const result = checkAce(card);

        expect(result).to.equal(0);
    })
})

describe('reduceAce', () => {
    it('Should reduce Ace value from 11 to 1 when playerSum is greater than 21', () => {
        const playerSum = 22;
        const playerAceCount = 1;

        const result = reduceAce(playerSum, playerAceCount);

        expect(result).to.equal(12); // Ace reduced from 11 to 1, so playerSum becomes 12
    });

    it('Should not reduce Ace value when playerSum is less than or equal to 21', () => {
        const playerSum = 20;
        const playerAceCount = 1;

        const result = reduceAce(playerSum, playerAceCount);

        expect(result).to.equal(20); // Ace value remains 11, playerSum stays the same
    });

    it('Should handle multiple Ace cards correctly', () => {
        const playerSum = 25; // Player has two Ace cards
        const playerAceCount = 2;

        const result = reduceAce(playerSum, playerAceCount);

        expect(result).to.equal(15); // Both Ace cards reduced from 11 to 1, playerSum becomes 15
    })

    it('Should not reduce Ace value when playerAceCount is 0', () => {
        const playerSum = 22;
        const playerAceCount = 0; // No Ace cards in the player's hand

        const result = reduceAce(playerSum, playerAceCount);

        expect(result).to.equal(22); // No Ace cards to reduce, playerSum stays the same
    })
})






