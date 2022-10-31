const Voting = artifacts.require("Voting");
const{BN,expectRevert,expectEvent} = require('@openzeppelin/test-helpers');
const{expect} = require('chai');
//const { contract } = require('hardhat');



contract("Voting",accounts =>{

    const _owner=accounts[0];
    const _person1 =accounts[1];
    const _person2 =accounts[2];
    const _person3 =accounts[3];
    const _person4 =accounts[4];
    const _person5 =accounts[5];
    const _person6 =accounts[6];
    const _person7 =accounts[7];
    const _valueZero=new BN(0);

    const _description1 = "this proposal brings you peace of mind";
    const _description2 = "this proposal brings you a smile";
    const _description3 = "this proposal brings you luck";

    let votingInstance;


    describe('---DEPLOYEMENT',function(){

        it('could DEPLOYED voting contract PROPRELY ',async()=>{
            
            const instance = await Voting.new({from:_owner});
            assert(instance.address !== '');

        })
    })


    describe('--- START VARIABLE',function(){
        
        beforeEach(async()=>{
            
            votingInstance = await Voting.new({from:_owner});

        })



        it('Should STARTED with RegisteringVoters in workflowStatus variable',async()=>{

            const workflowStatus =await votingInstance.workflowStatus();
            expect(workflowStatus).to.be.bignumber.equal(_valueZero);

        })


        it('should STARTED with value 0 in votedProposalId variable',async()=>{

            const winningProposal = await votingInstance.winningProposalID.call();
            expect(winningProposal).to.be.bignumber.equal(_valueZero);

        })

    })


    describe('--- CORE FUNCTION',function(){
        
        describe('-- ADD a new Voter',function(){

            beforeEach(async()=>{
        
                votingInstance = await Voting.new({from:_owner});
    
            })

            it('should ADD a new voter in mapping and GET their registration status',async()=>{
                
                await votingInstance.addVoter(_person1,{from:_owner});
                const voter = await votingInstance.getVoter.call(_person1,{from:_person1});
                expect(voter.isRegistered).to.be.true;

            })

            it('should ADD a new voter in mapping and GET their voting status',async()=>{
                
                await votingInstance.addVoter(_person1,{from:_owner});
                const voter = await votingInstance.getVoter.call(_person1,{from:_person1});
                expect(voter.hasVoted).to.be.false;

            })

            it('should ADD a new voter in mapping and GET their voted proposal id',async()=>{
                
                await votingInstance.addVoter(_person1,{from:_owner});
                const voter = await votingInstance.getVoter.call(_person1,{from:_person1});
                expect(voter.votedProposalId).to.be.bignumber.equal(_valueZero);

            })

            it('should ADD a new voter in mapping, this is OWNER and GET their registration status',async()=>{
                
                await votingInstance.addVoter(_owner,{from:_owner});
                const voter = await votingInstance.getVoter.call(_owner,{from:_owner});
                expect(voter.isRegistered).to.be.true;

            })

            it('should ADD 3 new voter in mapping and GET the voting status on SECOND voter',async()=>{
                
                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});

                const voter = await votingInstance.getVoter.call(_person2,{from:_person2});
                expect( voter.hasVoted ).to.be.false;

            })


        })


        describe('-- ADD a new proposal',function(){

            beforeEach(async()=>{
        
                votingInstance = await Voting.new({from:_owner});

                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner}); 
                await votingInstance.addVoter(_person3,{from:_owner}); 

                await votingInstance.startProposalsRegistering({from:_owner});
                
            })

            it('should have a BLANK proposal in array when STARTED Proposal registering session and GET their description',async()=>{
                
                
                const blankProposal = await votingInstance. getOneProposal.call(0,{from:_person1});
                expect(blankProposal.description).to.be.equal("GENESIS");
            
            })

            it('should have a BLANK proposal in array when STARTED Proposal registering session and GET voteCount',async()=>{
                
                
                const blankProposal = await votingInstance. getOneProposal.call(0,{from:_person1});
                expect(blankProposal.voteCount).to.be.bignumber.equal(new BN(0));
            
            })


            it('should ADD a new proposal in array and GET their description', async()=>{
                
                
                await votingInstance.addProposal(_description1,{from:_person1});
                const proposal = await votingInstance.getOneProposal.call(1,{from:_person1});
                expect(proposal.description).to.be.equal("this proposal brings you peace of mind");
           
            })


            it('should ADD a new proposal in array and GET their voteCount', async()=>{
                
                
                await votingInstance.addProposal(_description2,{from:_person1});
                const proposal = await votingInstance.getOneProposal.call(1,{from:_person1});
                expect(proposal.voteCount).to.be.bignumber.equal(_valueZero);
            
            })


            it('should ADD a SEVERAL proposals in array with SAME voter and GET second description', async()=>{


                await votingInstance.addProposal(_description1,{from:_person1});
                await votingInstance.addProposal(_description2,{from:_person1});
                const proposal = await votingInstance.getOneProposal.call(2,{from:_person1});
                expect(proposal.description).to.be.equal("this proposal brings you a smile");
            
            })


            it('should ADD a THREE proposals in array with DIFFERENT voter and GET last their voteCount', async()=>{


                await votingInstance.addProposal(_description1,{from:_person1});
                await votingInstance.addProposal(_description2,{from:_person3});
                await votingInstance.addProposal(_description3,{from:_person2});
                const proposal = await votingInstance.getOneProposal.call(3,{from:_person3});
                expect(proposal.voteCount).to.be.bignumber.equal(_valueZero);

            })

        })


        describe('-- SET a vote', function(){

            beforeEach(async()=>{
        
                votingInstance = await Voting.new({from:_owner});

                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});
                await votingInstance.addVoter(_person4,{from:_owner});
                await votingInstance.addVoter(_person5,{from:_owner});


                await votingInstance.startProposalsRegistering({from:_owner});

                await votingInstance.addProposal(_description1,{from:_person3});
                await votingInstance.addProposal(_description2,{from:_person2});
                await votingInstance.addProposal(_description3,{from:_person2});

                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});
                
            })



            it('should SET a BLANK vote (value ZERO) by voter, GET their status has Voted is true', async()=>{

                await votingInstance.setVote(_valueZero,{from:_person1});
                
                const voter = await votingInstance.getVoter.call(_person1,{from:_person1});
                expect(voter.hasVoted).to.be.true;
            })



            it('should SET a BLANK vote (value ZERO) by voter, GET the BLANK proposal voteCount is INCREMENTED', async()=>{

                await votingInstance.setVote(_valueZero,{from:_person1});
                
                const blankProposal = await votingInstance.getOneProposal.call(_valueZero,{from:_person1});
                expect(blankProposal.voteCount).to.be.bignumber.equal(new BN(1));
            })



            it('should SET a BLANK vote (value ZERO) by THREE voters, GET the BLANK proposal voteCount is THREE', async()=>{

                await votingInstance.setVote(_valueZero,{from:_person1});
                await votingInstance.setVote(_valueZero,{from:_person2});
                await votingInstance.setVote(_valueZero,{from:_person3});
                
                const blankProposal = await votingInstance.getOneProposal.call(_valueZero,{from:_person2});
                expect(blankProposal.voteCount).to.be.bignumber.equal(new BN(3));
            })



            it('should SET a vote by voter, GET their value votedProposalID ',async()=>{

                await votingInstance.setVote(new BN(1),{from:_person1});
                
                const voter = await votingInstance.getVoter.call(_person1,{from:_person1});
                expect(voter.votedProposalId).to.be.bignumber.equal(new BN(1));
            })



            it('should SET a vote by voter, GET their status has Voted is true',async()=>{

                await votingInstance.setVote(new BN(1),{from:_person2});
                
                const voter = await votingInstance.getVoter.call(_person2,{from:_person2});
                expect(voter.hasVoted).to.be.true;
            })



            it('should SET a vote by voter, GET the proposal voteCount is INCREMENTED',async()=>{

                await votingInstance.setVote(new BN(1),{from:_person2});
                
                const proposal = await votingInstance.getOneProposal.call(new BN(1),{from:_person1});
                expect(proposal.voteCount).to.be.bignumber.equal(new BN(1));
            })



            it('should SET a SAME votes by TWO voters, GET the proposal voteCount is TWO', async()=>{

                await votingInstance.setVote(new BN(2),{from:_person1});
                await votingInstance.setVote(new BN(2),{from:_person2});
                
                const proposal = await votingInstance.getOneProposal.call(new BN(2),{from:_person2});
                expect(proposal.voteCount).to.be.bignumber.equal(new BN(2));
            })


            it('should SET SEVERAL votes by FIVE voters, GET the proposals voteCount are INCREMENTED', async()=>{
                
                
                await votingInstance.setVote(new BN(3),{from:_person1});
                await votingInstance.setVote(new BN(2),{from:_person2});
                await votingInstance.setVote(_valueZero,{from:_person3});
                await votingInstance.setVote(new BN(2),{from:_person4});
                await votingInstance.setVote(new BN(3),{from:_person5});

                const proposal2 = await votingInstance.getOneProposal.call(new BN(2),{from:_person1});
                const proposal3 = await votingInstance.getOneProposal.call(new BN(2),{from:_person5});
                const blankProposal = await votingInstance.getOneProposal.call(_valueZero,{from:_person2});

                expect(proposal2.voteCount).to.be.bignumber.equal(new BN(2));
                expect(proposal3.voteCount).to.be.bignumber.equal(new BN(2));
                expect(blankProposal.voteCount).to.be.bignumber.equal(new BN(1));


            })



        })

        describe('-- RESULT a tally votes',function(){

            beforeEach(async()=>{
        
                votingInstance = await Voting.new({from:_owner});

                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});
                await votingInstance.addVoter(_person4,{from:_owner});
                await votingInstance.addVoter(_person5,{from:_owner});
                await votingInstance.addVoter(_person6,{from:_owner});
                await votingInstance.addVoter(_person7,{from:_owner});


                await votingInstance.startProposalsRegistering({from:_owner});

                await votingInstance.addProposal(_description1,{from:_person3});
                await votingInstance.addProposal(_description2,{from:_person2});
                await votingInstance.addProposal(_description3,{from:_person2});

                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});

                await votingInstance.setVote(new BN(3),{from:_person1});
                await votingInstance.setVote(new BN(2),{from:_person2});
                await votingInstance.setVote(_valueZero,{from:_person3});
                await votingInstance.setVote(new BN(1),{from:_person4});
                await votingInstance.setVote(new BN(3),{from:_person5});
                
                
            })

            it('should RESULT a tally votes with WINNING proposal THREE, GET their ID,',async()=>{


                await votingInstance.endVotingSession({from:_owner});
                await votingInstance.tallyVotes({from:_owner});

                const winnerId= await votingInstance.winningProposalID.call({from:_owner});
                expect(winnerId).to.be.bignumber.equal(new BN(3));

            })

            it('should RESULT a tally votes with WINNING proposal TWO, GET their description,',async()=>{

                await votingInstance.setVote(new BN(2),{from:_person6});
                await votingInstance.setVote(new BN(2),{from:_person7});

                await votingInstance.endVotingSession({from:_owner});
                await votingInstance.tallyVotes({from:_owner});

                const winnerId= await votingInstance.winningProposalID.call({from:_owner});
                const proposal = await votingInstance.getOneProposal.call(winnerId,{from:_person1});
                expect(proposal.description).to.be.equal("this proposal brings you a smile");

            })


            it('should RESULT a tally votes with BLANK winner, CHECK winner id Proposal does not CHANGE',async()=>{

                await votingInstance.setVote(_valueZero,{from:_person6});
                await votingInstance.setVote(_valueZero,{from:_person7});
                await votingInstance.endVotingSession({from:_owner});

                const resulBeforeTallyVotes = await votingInstance.winningProposalID.call();
                expect(resulBeforeTallyVotes).to.be.bignumber.equal(_valueZero);

                await votingInstance.tallyVotes({from:_owner});

                const winnerId= await votingInstance.winningProposalID.call({from:_owner});
                expect(winnerId).to.be.bignumber.equal(resulBeforeTallyVotes);

            })



            it('should RESULT a tally votes with EGALITY ( ID TWO and THREE ), CHECK choose FIRST found (TWO) ',async()=>{


                await votingInstance.setVote(new BN(2),{from:_person6});
                await votingInstance.endVotingSession({from:_owner});
                await votingInstance.tallyVotes({from:_owner});

                const winnerId= await votingInstance.winningProposalID.call({from:_owner});
                expect(winnerId).to.be.bignumber.equal(new BN(2));


            })




            it('should RESULT a tally votes with THREE EGALITY ( BLANK, TWO and THREE ), CHECK choose BLANK votes ',async()=>{


                await votingInstance.setVote(_valueZero,{from:_person6});
                await votingInstance.setVote(new BN(2),{from:_person7});
                await votingInstance.endVotingSession({from:_owner});

                await votingInstance.tallyVotes({from:_owner});

                const winnerId= await votingInstance.winningProposalID.call({from:_owner});
                expect(winnerId).to.be.bignumber.equal(_valueZero);


            })


            

        })

    })

    describe('---REQUIRE',function(){

        describe( '-- NOT add a voter',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});

            })

            it('should NOT add a voter if you are NOT owner, REVERT if that TRUE', async () =>{

                await expectRevert( votingInstance.addVoter(_person1,{from:_person1}),"Ownable: caller is not the owner");
            
            })


            it('should NOT add a voter if workflowStatus is NOT EQUAL than RegisteringVoters, REVERT if that TRUE',async()=>{

                
                await votingInstance.startProposalsRegistering({from:_owner});
                const status = await votingInstance.workflowStatus.call({from:_person1});
                expect(status).to.be.bignumber.equal(new BN(1));
                
                await expectRevert( votingInstance.addVoter(_person1,{from:_owner}),'Voters registration is not open yet');
            
            })

            it('should NOT add a voter if voter ALREADY registered, REVERT if that TRUE',async()=>{

                await votingInstance.addVoter(_person1,{from:_owner});
                await expectRevert( votingInstance.addVoter(_person1,{from:_owner}),'Already registered');
            
            })


        })

        describe('-- NOT get a voter',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});

            })

            it('should NOT get a voter if you are NOT voter, REVERT if that TRUE', async () =>{

                
                await expectRevert( votingInstance.getVoter.call(_person1,{from:_owner}),"You're not a voter");
            
            })

        })

        describe('-- NOT add a proposal',function(){
            
            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});
                await votingInstance.startProposalsRegistering({from:_owner});
            
            })

            

            it('should NOT add a proposal in array if you are NOT a voter, REVERT if that TRUE', async () =>{

                
                await expectRevert( votingInstance.addProposal(_description1,{from:_owner}),"You're not a voter");
            
            })


            it('should NOT add a proposal in array if workflowStatus is NOT EQUAL than ProposalsRegistrationStarted, REVERT if that TRUE',async()=>{


                await votingInstance.endProposalsRegistering({from:_owner});
                const status = await votingInstance.workflowStatus.call({from:_person1});
                expect(status).to.be.bignumber.equal(new BN(2)); 
                await expectRevert( votingInstance.addProposal(_person1,{from:_person1}),'Proposals are not allowed yet');
            
           
            })


            it('should NOT add a proposal in array if a voter does NOT write a description, REVERT if that TRUE',async()=>{

                await expectRevert( votingInstance.addProposal("",{from:_person1}),'Vous ne pouvez pas ne rien proposer');
            
            })

        })

        describe('-- NOT get a proposal',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});

            })

            it('should NOT get a proposal if you are NOT voter, REVERT if that TRUE', async () =>{

                
                await expectRevert( votingInstance.getOneProposal.call(new BN(1),{from:_owner}),"You're not a voter");
            
            })

        })

        describe('-- NOT set a vote',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                
                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});
                await votingInstance.addVoter(_person4,{from:_owner});

                await votingInstance.startProposalsRegistering({from:_owner});

                await votingInstance.addProposal(_description1,{from:_person1});
                await votingInstance.addProposal(_description2,{from:_person3});
                await votingInstance.addProposal(_description3,{from:_person3});
                
                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});
            
            })
            
            it('should NOT set a vote if it is NOT a voter, REVERT if that TRUE', async () =>{

                await expectRevert( votingInstance.setVote(new BN(1),{from:_owner}),"You're not a voter");
                

            })

            
            it('should NOT add a voter if workflowStatus is NOT EQUAL than VotingSessionStarted, REVERT if that TRUE', async () =>{


                await votingInstance.endVotingSession({from:_owner});
                const status = await votingInstance.workflowStatus.call({from:_person1});
                expect(status).to.be.bignumber.equal(new BN(4)); 
                await expectRevert( votingInstance.setVote(new BN(0),{from:_person1}),'Voting session havent started yet');

            
            })

            it('should NOT set a vote if a voter ALREADY voted, REVERT if that TRUE', async () =>{

                await votingInstance.setVote(new BN(1),{from:_person1});
                const voter = await votingInstance.getVoter(_person1,{from:_person1});
                expect(voter.hasVoted).to.be.true;
                await expectRevert( votingInstance.setVote(new BN(2),{from:_person1}),'You have already voted');
                

            })


            it('should NOT set a vote if a prosposal id is OVERFLOWED, REVERT if that TRUE', async () =>{

                await expectRevert( votingInstance.setVote(new BN(5),{from:_person1}),'Proposal not found');

            })


        })

        describe('-- Not result a tallyvotes',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                
                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.addVoter(_person2,{from:_owner});
                await votingInstance.addVoter(_person3,{from:_owner});
                await votingInstance.addVoter(_person4,{from:_owner});

                await votingInstance.startProposalsRegistering({from:_owner});

                await votingInstance.addProposal(_description1,{from:_person1});
                await votingInstance.addProposal(_description2,{from:_person3});
                await votingInstance.addProposal(_description3,{from:_person3});
                
                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});

                await votingInstance.setVote(new BN(0),{from:_person1});
                await votingInstance.setVote(new BN(2),{from:_person2});
                await votingInstance.setVote(new BN(1),{from:_person3});
                await votingInstance.setVote(new BN(1),{from:_person4});
                
                
            })


            it('should NOT result a tallyvotes if you are NOT a owner, REVERT if that TRUE', async () =>{

                await votingInstance.endVotingSession({from:_owner});
                await expectRevert( votingInstance.tallyVotes({from:_person1}),"Ownable: caller is not the owner");
                
            })


            it('should NOT result a tallyvotes if workflowStatus is NOT EQUAL than VotingSessionEnded, REVERT if that TRUE', async () =>{

                const status = await votingInstance.workflowStatus.call({from:_person1});
                expect(status).to.be.bignumber.equal(new BN(3)); 
                await expectRevert( votingInstance.tallyVotes({from:_owner}),"Current status is not voting session ended");

            
            })
        })
       
        describe( '-- NOT start a Workflow status', function(){


            describe('-- NOT start proposalRegistering',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_person1,{from:_owner});
                    
                
                })


                it('should NOT start a ProposalsRegistration status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await expectRevert(votingInstance.startProposalsRegistering({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a ProposalsRegistration status if workflowStatus is NOT EQUAL than RegisteringVoters, REVERT if that TRUE', async()=>{

                    await votingInstance.startProposalsRegistering({from:_owner});
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(new BN(1));
                    await expectRevert(votingInstance.startProposalsRegistering({from:_owner}),'Registering proposals cant be started now');
    
                })
            })
            
            describe('-- NOT start endProposalsRegistering',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_person1,{from:_owner});
                    
                })


                it('should NOT start a endProposalsRegistering status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await votingInstance.startProposalsRegistering({from:_owner});
                    await expectRevert(votingInstance.endProposalsRegistering({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a endProposalsRegistering status if workflowStatus is NOT EQUAL than startProposalsRegistering, REVERT if that TRUE', async()=>{

                    
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(new BN(0));
                    await expectRevert(votingInstance.endProposalsRegistering({from:_owner}),'Registering proposals havent started yet');
    
                })
            })
            
            describe('-- NOT start endProposalsRegistering',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_person1,{from:_owner});
                    
                })


                it('should NOT start a endProposalsRegistering status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await votingInstance.startProposalsRegistering({from:_owner});
                    await expectRevert(votingInstance.endProposalsRegistering({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a endProposalsRegistering status if workflowStatus is NOT EQUAL than startProposalsRegistering, REVERT if that TRUE', async()=>{

                    
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(_valueZero);
                    await expectRevert(votingInstance.endProposalsRegistering({from:_owner}),'Registering proposals havent started yet');
    
                })
            })
           
            describe('-- NOT start startVotingSession',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_person1,{from:_owner});
                    await votingInstance.startProposalsRegistering({from:_owner});
                    
                })


                it('should NOT start a startVotingSession status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await votingInstance.endProposalsRegistering({from:_owner});
                    await expectRevert(votingInstance.startVotingSession({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a startVotingSession status if workflowStatus is NOT EQUAL than ProposalsRegistrationEnded, REVERT if that TRUE', async()=>{

                    
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(new BN(1));
                    await expectRevert(votingInstance.startVotingSession({from:_owner}),'Registering proposals phase is not finished');
    
                })
            })

            describe('-- NOT start endVotingSession',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    
                    await votingInstance.addVoter(_person1,{from:_owner});
                    await votingInstance.startProposalsRegistering({from:_owner});
                    await votingInstance.endProposalsRegistering({from:_owner});
                })


                it('should NOT start a endVotingSession status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await votingInstance.startVotingSession({from:_owner});
                    await expectRevert(votingInstance.endVotingSession({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a endVotingSession status if workflowStatus is NOT EQUAL than VotingSessionStarted, REVERT if that TRUE', async()=>{

                    
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(new BN(2));
                    await expectRevert(votingInstance.endVotingSession({from:_owner}),'Voting session havent started yet');
    
                })
            })

            describe('-- NOT start endVotingSession',function(){
                
                beforeEach(async()=>{

                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_person1,{from:_owner});
                    await votingInstance.startProposalsRegistering({from:_owner});
                    await votingInstance.endProposalsRegistering({from:_owner});
                })


                it('should NOT start a endVotingSession status if it is NOT owner, REVERT if that TRUE', async ()=>{

                    await votingInstance.startVotingSession({from:_owner});
                    await expectRevert(votingInstance.endVotingSession({from:_person1}),"Ownable: caller is not the owner");
                })

                it('should NOT start a endVotingSession status if workflowStatus is NOT EQUAL than VotingSessionStarted, REVERT if that TRUE', async()=>{

                    
                    const status = await votingInstance.workflowStatus.call({from:_person1});
                    expect(status).to.be.bignumber.equal(new BN(2));
                    await expectRevert(votingInstance.endVotingSession({from:_owner}),'Voting session havent started yet');
    
                })
            })

        })
    })

    describe('---EVENTS',function(){


        describe('-- EMIT an event WHEN add a voter',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
            })
    
            it('should EMIT an Event WHEN add a voter, who registers his address',async()=>{
    
                const receipt =await votingInstance.addVoter(_person1,{from:_owner});
                expectEvent(receipt,'VoterRegistered',{voterAddress :_person1});
    
            })
    

        })

        describe('-- EMIT an event WHEN add a proposal',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});
                await votingInstance.startProposalsRegistering({from:_owner});
            })
    
            it('should EMIT an Event WHEN add a voter, who registers a proposals size',async()=>{
    
                const receipt =await votingInstance.addProposal(_description1,{from:_person1});
                expectEvent(receipt,'ProposalRegistered',{proposalId :new BN(1)});
    
            })
    

        })

        describe('-- EMIT an event WHEN set a vote',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});

                await votingInstance.startProposalsRegistering({from:_owner});
                await votingInstance.addProposal(_description1,{from:_person1});
                await votingInstance.addProposal(_description2,{from:_person1});

                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});
            })
    
            it('should EMIT an Event WHEN set a vote, who registers his address and vote ID',async()=>{
    
                const receipt =await votingInstance.setVote(new BN(1),{from:_person1});
                expectEvent(receipt,'Voted',{
                    voter :_person1,
                    proposalId:new BN(1)
                });
    
            })
    

        })

        describe('-- EMIT an event WHEN END process a workflow status',function(){

            beforeEach(async()=>{

                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_person1,{from:_owner});

            })
    
            it('should EMIT an Event WHEN END process startProposalsRegistering status, who registers PREVIOUS and NEW status',async()=>{
    
                const receipt =await votingInstance.startProposalsRegistering({from:_owner});
                expectEvent(receipt,'WorkflowStatusChange',{
                    previousStatus :_valueZero,
                    newStatus:new BN(1)
                });
    
            })


            it('should EMIT an Event WHEN END process endProposalsRegistering status, who registers PREVIOUS and NEW status',async()=>{
                
                await votingInstance.startProposalsRegistering({from:_owner});
                
                const receipt =await votingInstance.endProposalsRegistering({from:_owner});
                expectEvent(receipt,'WorkflowStatusChange',{
                    previousStatus :new BN(1),
                    newStatus:new BN(2)
                });
    
            })

            it('should EMIT an Event WHEN END process startVotingSession status, who registers PREVIOUS and NEW status',async()=>{
                
                await votingInstance.startProposalsRegistering({from:_owner});
                await votingInstance.endProposalsRegistering({from:_owner});
                
                const receipt =await votingInstance.startVotingSession({from:_owner});
                expectEvent(receipt,'WorkflowStatusChange',{
                    previousStatus :new BN(2),
                    newStatus:new BN(3)
                });
    
            })

            it('should EMIT an Event WHEN END process endVotingSession status, who registers PREVIOUS and NEW status',async()=>{
                
                await votingInstance.startProposalsRegistering({from:_owner});
                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});
                
                const receipt =await votingInstance.endVotingSession({from:_owner});
                expectEvent(receipt,'WorkflowStatusChange',{
                    previousStatus :new BN(3),
                    newStatus:new BN(4)
                });
    
            })

            it('should EMIT an Event WHEN END process tallyVotes status, who registers PREVIOUS and NEW status',async()=>{
                
                await votingInstance.startProposalsRegistering({from:_owner});
                await votingInstance.endProposalsRegistering({from:_owner});
                await votingInstance.startVotingSession({from:_owner});
                await votingInstance.endVotingSession({from:_owner});
                
                const receipt =await votingInstance.tallyVotes({from:_owner});
                expectEvent(receipt,'WorkflowStatusChange',{
                    previousStatus :new BN(4),
                    newStatus:new BN(5)
                });
    
            })
    

        })
       
    })

})
