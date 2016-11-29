import chai, { expect } from 'chai'
chai.should()

import as_you_type, { close_dangling_braces } from '../source/as you type'

describe('as you type', () =>
{
	it('should parse and format phone numbers as you type', function()
	{
		// International number test
		new as_you_type().input('+12133734').should.equal('+1 213 373 4')
		// Local number test
		new as_you_type('US').input('2133734').should.equal('(213) 373-4')

		// With national prefix test
		new as_you_type('RU').input('88005553535').should.equal('8 (800) 555-35-35')
		new as_you_type('RU').input('8800555353').should.equal('8 (800) 555-35-3')

		new as_you_type('CH').input('044-668-1').should.equal('044 668 1')

		let formatter

		// Test International phone number (USA)

		formatter = new as_you_type()

		formatter.input('+').should.equal('+')
		formatter.input('1').should.equal('+1')
		formatter.input('2').should.equal('+1 2')
		formatter.input('2').should.equal('+1 22')
		formatter.input('2').should.equal('+1 222')
		formatter.input(' ').should.equal('+1 222')
		formatter.input('3').should.equal('+1 222 3')
		formatter.input('3').should.equal('+1 222 33')
		formatter.input('3').should.equal('+1 222 333')
		formatter.input('4').should.equal('+1 222 333 4')
		formatter.input('4').should.equal('+1 222 333 44')
		formatter.input('4').should.equal('+1 222 333 444')
		formatter.input('4').should.equal('+1 222 333 4444')
		formatter.input('5').should.equal('+122233344445')

		// Check that clearing an international formatter
		// also clears country metadata.

		formatter.reset()

		formatter.input('+').should.equal('+')
		formatter.input('7').should.equal('+7')
		formatter.input('9').should.equal('+7 9')
		formatter.input('99 111 22 33').should.equal('+7 999 111 22 33')

		// Test Switzerland phone numbers

		formatter = new as_you_type('CH')

		formatter.input(' ').should.equal('')
		formatter.input('0').should.equal('0')
		formatter.input('4').should.equal('04')
		formatter.input(' ').should.equal('04')
		formatter.input('-').should.equal('04')
		formatter.input('4').should.equal('044')
		formatter.input('-').should.equal('044')
		formatter.input('6').should.equal('044 6')
		formatter.input('6').should.equal('044 66')
		formatter.input('8').should.equal('044 668')
		formatter.input('-').should.equal('044 668')
		formatter.input('1').should.equal('044 668 1')
		formatter.input('8').should.equal('044 668 18')
		formatter.input(' 00').should.equal('044 668 18 00')
		formatter.input('9').should.equal('04466818009')

		// Test Russian phone numbers
		// (with optional national prefix `8`)

		formatter = new as_you_type('RU')

		formatter.input('8').should.equal('8')
		formatter.input('9').should.equal('8 (9  )')
		formatter.input('9').should.equal('8 (99 )')
		formatter.input('9').should.equal('8 (999)')
		formatter.input('-').should.equal('8 (999)')
		formatter.input('1234').should.equal('8 (999) 123-4')
		formatter.input('567').should.equal('8 (999) 123-45-67')
		formatter.input('8').should.equal('899912345678')

		// Check that clearing an national formatter:
		//  * doesn't clear country metadata
		//  * clears all other things

		formatter.reset()

		formatter.input('8').should.equal('8')
		formatter.input('9').should.equal('8 (9  )')
		formatter.input('9').should.equal('8 (99 )')
		formatter.input('9').should.equal('8 (999)')
		formatter.input('-').should.equal('8 (999)')
		formatter.input('1234').should.equal('8 (999) 123-4')
		formatter.input('567').should.equal('8 (999) 123-45-67')
		formatter.input('8').should.equal('899912345678')
	})

	it('should close dangling braces', function()
	{
		close_dangling_braces('(9)', 2).should.equal('(9)')

		let formatter

		// Test braces (US)

		formatter = new as_you_type('US')

		formatter.input('9').should.equal('(9  )')
		formatter.input('9').should.equal('(99 )')
		formatter.input('9').should.equal('(999)')
		formatter.input('1').should.equal('(999) 1')

		// Test braces (RU)

		formatter = new as_you_type('RU')

		formatter.input('8').should.equal('8')
		formatter.input('9').should.equal('8 (9  )')
		formatter.input('9').should.equal('8 (99 )')
		formatter.input('9').should.equal('8 (999)')
		formatter.input('1').should.equal('8 (999) 1')
	})
})