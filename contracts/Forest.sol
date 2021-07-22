// File: openzeppelin-solidity-2.3.0/contracts/math/Math.sol

pragma solidity ^0.5.0;

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow, so we distribute
        return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
    }
}

// File: openzeppelin-solidity-2.3.0/contracts/math/SafeMath.sol

pragma solidity ^0.5.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}

// File: openzeppelin-solidity-2.3.0/contracts/token/ERC20/IERC20.sol

pragma solidity ^0.5.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see `ERC20Detailed`.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `Transfer` event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through `transferFrom`. This is
     * zero by default.
     *
     * This value changes when `approve` or `transferFrom` are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * > Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an `Approval` event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `Transfer` event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to `approve`. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: openzeppelin-solidity-2.3.0/contracts/token/ERC20/ERC20Detailed.sol

pragma solidity ^0.5.0;


/**
 * @dev Optional functions from the ERC20 standard.
 */
contract ERC20Detailed is IERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Sets the values for `name`, `symbol`, and `decimals`. All three of
     * these values are immutable: they can only be set once during
     * construction.
     */
    constructor (string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei.
     *
     * > Note that this information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * `IERC20.balanceOf` and `IERC20.transfer`.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }
}

// File: openzeppelin-solidity-2.3.0/contracts/utils/Address.sol

pragma solidity ^0.5.0;

/**
 * @dev Collection of functions related to the address type,
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * This test is non-exhaustive, and there may be false-negatives: during the
     * execution of a contract's constructor, its address will be reported as
     * not containing a contract.
     *
     * > It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
}

// File: openzeppelin-solidity-2.3.0/contracts/token/ERC20/SafeERC20.sol

pragma solidity ^0.5.0;




/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for ERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value);
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

// File: openzeppelin-solidity-2.3.0/contracts/utils/ReentrancyGuard.sol

pragma solidity ^0.5.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the `nonReentrant` modifier
 * available, which can be aplied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 */
contract ReentrancyGuard {
    /// @dev counter to allow mutex lock with only one SSTORE operation
    uint256 private _guardCounter;

    constructor () internal {
        // The counter starts at one to prevent changing it from zero to a non-zero
        // value, which is a more expensive operation.
        _guardCounter = 1;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _guardCounter += 1;
        uint256 localCounter = _guardCounter;
        _;
        require(localCounter == _guardCounter, "ReentrancyGuard: reentrant call");
    }
}

// File: contracts/interfaces/IStakingRewards.sol

pragma solidity >=0.4.24;

// https://docs.synthetix.io/contracts/source/interfaces/istakingrewards
interface IStakingRewards {
    // Views

    function balanceOf(address account) external view returns (uint256);

    function earned(address account) external view returns (uint256);

    function getRewardForDuration() external view returns (uint256);

    function lastTimeRewardApplicable() external view returns (uint256);

    function rewardPerToken() external view returns (uint256);

    function rewardsDistribution() external view returns (address);

    function rewardsToken() external view returns (address);

    function totalSupply() external view returns (uint256);

    // Mutative

    function exit() external;

    function getReward() external;

    function stake(uint256 amount) external;

    function withdraw(uint256 amount) external;
}

// File: contracts/Owned.sol

pragma solidity ^0.5.16;

// https://docs.synthetix.io/contracts/source/contracts/owned
contract Owned {
    address public owner;
    address public nominatedOwner;

    constructor(address _owner) public {
        require(_owner != address(0), "Owner address cannot be 0");
        owner = _owner;
        emit OwnerChanged(address(0), _owner);
    }

    function nominateNewOwner(address _owner) external onlyOwner {
        nominatedOwner = _owner;
        emit OwnerNominated(_owner);
    }

    function acceptOwnership() external {
        require(msg.sender == nominatedOwner, "You must be nominated before you can accept ownership");
        emit OwnerChanged(owner, nominatedOwner);
        owner = nominatedOwner;
        nominatedOwner = address(0);
    }

    modifier onlyOwner {
        _onlyOwner();
        _;
    }

    function _onlyOwner() private view {
        require(msg.sender == owner, "Only the contract owner may perform this action");
    }

    event OwnerNominated(address newOwner);
    event OwnerChanged(address oldOwner, address newOwner);
}

// File: contracts/RewardsDistributionRecipient.sol

pragma solidity ^0.5.16;

// Inheritance


// https://docs.synthetix.io/contracts/source/contracts/rewardsdistributionrecipient
contract RewardsDistributionRecipient is Owned {
    address public rewardsDistribution;

    function notifyRewardAmount(uint256 reward) external;

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
        _;
    }

    function setRewardsDistribution(address _rewardsDistribution) external onlyOwner {
        rewardsDistribution = _rewardsDistribution;
    }
}

// File: contracts/Pausable.sol

pragma solidity ^0.5.16;

// Inheritance


// https://docs.synthetix.io/contracts/source/contracts/pausable
contract Pausable is Owned {
    uint public lastPauseTime;
    bool public paused;

    constructor() internal {
        // This contract is abstract, and thus cannot be instantiated directly
        require(owner != address(0), "Owner must be set");
        // Paused will be false, and lastPauseTime will be 0 upon initialisation
    }

    /**
     * @notice Change the paused state of the contract
     * @dev Only the contract owner may call this.
     */
    function setPaused(bool _paused) external onlyOwner {
        // Ensure we're actually changing the state before we do anything
        if (_paused == paused) {
            return;
        }

        // Set our paused state.
        paused = _paused;

        // If applicable, set the last pause time.
        if (paused) {
            lastPauseTime = now;
        }

        // Let everyone know that our pause state has changed.
        emit PauseChanged(paused);
    }

    event PauseChanged(bool isPaused);

    modifier notPaused {
        require(!paused, "This action cannot be performed while the contract is paused");
        _;
    }
}

// File: contracts/StakingRewards.sol

pragma solidity ^0.5.16;






// Inheritance


interface IKuka {
    function _maxTxAmount() external view returns (uint);
}

// https://docs.synthetix.io/contracts/source/contracts/stakingrewards
contract StakingRewards is IStakingRewards, RewardsDistributionRecipient, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public rewardsToken;
    IERC20 public stakingToken;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public rewardsDuration = 7 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    // the destination for all reflected tokens (if received) via the staking contract
    address public sweepDestination;

    // tracker for all reflections earned, if any
    uint public totalReflectionsEarned;

    // tracker for total rewards paid out
    uint public totalRewardsPaid;

    // tracker for flat deposit fees earned from the fee model (taken in any token)
    mapping(address => uint256) public totalFeesEarned;

    // tracker for total rewards earned for an account
    mapping(address => uint256) public totalRewardsEarned;

    // percentage for deposit fee, if enabled
    uint public depositFeePercent;

    // flat deposit fee, if enabled
    uint public flatFee;

    // flat deposit fee token, if enabled
    address public flatFeeToken;

    // destination address for all fees, if any
    address public feeDestination;

    // scale percentages from 000.00001% to 100.00000
    uint constant DIVISOR = 10000000;

    // set max percent fee to 10% of deposits
    uint constant MAX_PERCENT_FEE = 1000000;

    // 0 = no fee,
    // 1 = deposit % fee
    // 2 = flat fee
    uint public feeModel;

    // implement a maximum amount of tokens that can be tracked as deposited
    uint public maximumTotalStaked;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _owner,
        address _rewardsDistribution,
        address _rewardsToken,
        address _stakingToken,
        address _sweepStakedReflectionsDestination,
        address _flatFeeToken,
        address _feeDestination,
        uint _flatFee,
        uint _depositFeePercent,
        uint _feeModel,
        uint _maximumTotalStaked
    ) public Owned(_owner) {
        rewardsToken = IERC20(_rewardsToken);
        stakingToken = IERC20(_stakingToken);
        rewardsDistribution = _rewardsDistribution;
        sweepDestination = _sweepStakedReflectionsDestination;

        if(_feeModel == 1)
            require(_depositFeePercent <= MAX_PERCENT_FEE, "Forest: Deposit fee too high, must be less than 10%.");

        //if no token was supplied then set it to the staking token
        if(_flatFeeToken == address(0))
            flatFeeToken = _stakingToken;
        else
            flatFeeToken = _flatFeeToken;
        
        feeDestination = _feeDestination;
        flatFee = _flatFee;
        depositFeePercent = _depositFeePercent;
        feeModel = _feeModel;

        maximumTotalStaked = _maximumTotalStaked;
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(_totalSupply)
            );
    }

    function earned(address account) public view returns (uint256) {
        return _balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    // view forest info relevant to stakers before they stake
    function viewForestSettings()
    external view returns (uint, uint, uint, uint, uint, uint, uint) {
        return (flatFee,
                depositFeePercent,
                feeModel,
                maximumTotalStaked,
                _totalSupply,
                rewardRate.mul(rewardsDuration),
                (periodFinish > block.timestamp ? periodFinish - block.timestamp : 0));
    }

    function viewForestTokens()
    external view returns (address, address, address) {
        return (address(stakingToken), flatFeeToken, address(rewardsToken));
    }

    // view forest info relevant to stakers while staked
    // amount staked, rewards to claim
    // how long the reward period has left
    function viewForestInfoFor(address who)
    external view returns (uint, uint, uint, uint, uint, uint) {
        return (_balances[who],
                _balances[who].mul(rewardPerToken().sub(userRewardPerTokenPaid[who])).div(1e18).add(rewards[who]),
                rewardsDuration,
                IERC20(address(rewardsToken)).balanceOf(who),
                IERC20(address(stakingToken)).balanceOf(who),
                flatFeeToken == address(0) ? 0 : IERC20(address(flatFeeToken)).balanceOf(who));
    }

    // view all-time stats for this Forest
    function viewForestStats(address _feeToken)
    external view returns (uint, uint, uint, uint) {
        return (totalReflectionsEarned, _viewCurrentReflections(), totalRewardsPaid, totalFeesEarned[_feeToken]);
    } 

    // used by UI to check approvals for staking and flat fee token (if it exists)
    function viewApprovalsNeeded(address[] calldata _tokens, uint[] calldata _amounts, address _who)
    external view returns (address[] memory) {
        address[] memory tokensNeedingApproval = new address[](_tokens.length);

        for(uint x = 0;x < _tokens.length; x++)
            if(_tokens[x] != address(0x0))
                if(IERC20(_tokens[x]).allowance(_who, address(this)) < _amounts[x])
                    tokensNeedingApproval[x] = _tokens[x];

        return tokensNeedingApproval;
    }

    function _viewCurrentReflections()
    internal view returns (uint) {
        uint reflections;

        if(stakingToken.balanceOf(address(this)) > _totalSupply)
            reflections = stakingToken.balanceOf(address(this)).sub(_totalSupply);

        return reflections;
    }

    function viewCurrentReflections()
    external view returns (uint) {
        return _viewCurrentReflections();
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(uint256 originalAmount) external nonReentrant notPaused updateReward(msg.sender) sweepTrigger {
        _stakeFor(originalAmount, msg.sender, msg.sender);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        uint actualAmount = _checkMaxTxAndSafeTransfer(msg.sender, amount, true);

        _totalSupply = _totalSupply.sub(actualAmount);
        _balances[msg.sender] = _balances[msg.sender].sub(actualAmount);
        emit Withdrawn(msg.sender, actualAmount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        _getRewardFor(msg.sender);
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    // allow the sweep function to be called at any point by anyone (ie incentive layer)
    function sweep() external nonReentrant {
        _sweepStakedReflections();
    }

    function _stakeFor(uint originalAmount, address who, address from)
    internal {
        require(originalAmount > 0, "Cannot stake 0");

        // record the balance before transferring so the final received amount can be determined regardless of fee on transfer
        uint balanceBefore = stakingToken.balanceOf(address(this));

        // transfer the tokens from the depositor
        stakingToken.safeTransferFrom(from, address(this), originalAmount);

        // record the balance after the tokens were transferred to this contract
        uint balanceAfter = stakingToken.balanceOf(address(this));

        // calculate what was actually staked (the difference between before and after)
        uint actualStakedAmount = balanceAfter.sub(balanceBefore);

        // deposit fee in tokens (calculated via % or flat fee)
        uint depositFee;

        // if there is a fee
        if(feeModel > 0) {
            // is the fee model a % of the deposit fee?
            if(feeModel == 1) {
                // set the deposit fee to be a % of the actual staked amount
                depositFee = actualStakedAmount.mul(depositFeePercent).div(DIVISOR);

                // subtract the deposit fee amount from the actual staked amount (what is credited to the user as a deposit)
                actualStakedAmount = actualStakedAmount.sub(depositFee);

                // transfer the deposit fee amount to the feeDestination
                // ...we dont use _checkMaxTxAndSafeTransfer() because the first transfer in this function would have reverted if it was above the max tx value - and the depositFee amount will always be less than that
                stakingToken.safeTransfer(feeDestination, depositFee);

                totalFeesEarned[address(stakingToken)] = totalFeesEarned[address(stakingToken)].add(depositFee);
            }
            // is the fee model a flat deposit fee?
            if(feeModel == 2) {
                // set the deposit fee to be equal to the flatFee
                depositFee = flatFee;

                // if the flat fee token is also the staking token
                if(flatFeeToken == address(stakingToken)) {
                    // subtract the deposit fee from the actual staked amount
                    actualStakedAmount = actualStakedAmount.sub(depositFee);

                    // we already deposited the staking token, so we transfer it out from this contract
                    stakingToken.safeTransfer(feeDestination, depositFee);
                } else {
                    // transfer out the flat fee token from the depositor
                    IERC20(flatFeeToken).safeTransferFrom(from, feeDestination, depositFee);
                }

                totalFeesEarned[flatFeeToken] = totalFeesEarned[flatFeeToken].add(depositFee);
            }
        }

        // if the maximum staked amount is greater than 0 (enabled)
        if(maximumTotalStaked > 0)
            // make sure that we are not above the maximum staked amount if this deposit were to go through
            require(_totalSupply.add(actualStakedAmount) <= maximumTotalStaked, "Forest: Staking capacity reached.");

        _totalSupply = _totalSupply.add(actualStakedAmount);
        _balances[who] = _balances[who].add(actualStakedAmount);
        
        emit Staked(who, actualStakedAmount);
    }

    function _getRewardFor(address who)
    internal {
        uint256 reward = rewards[who];
        if (reward > 0) {
            uint actualReward = _checkMaxTxAndSafeTransfer(who, reward, false);
            // instead of wiping this to zero, we check the actual amount transferred and subtract it from the balance
            rewards[who] = rewards[who].sub(actualReward);
            // track total rewards paid out
            totalRewardsPaid = totalRewardsPaid.add(actualReward);
            // track total rewards paid out specific to this account
            totalRewardsEarned[who] = totalRewardsEarned[who].add(actualReward);
            emit RewardPaid(who, actualReward);
        }
    }

    // the staking AND/OR the reward token can have a maximum tx value, so this function checks the intended transfer amount against the maximum transfer value
    // ...and returns what was actually transferred
    function _checkMaxTxAndSafeTransfer(address destination, uint tokens, bool staking)
    internal returns (uint) {
        // check to see if the token being transferred has a maximum transfer value - only for RFI 'standard' compliant tokens (so most)
        address activeToken = staking ? address(stakingToken) : address(rewardsToken);
        (bool success,) = activeToken.call(abi.encodeWithSignature("_maxTxAmount()"));

        uint transferAmount = tokens;
        
        // this token has a maximum transfer value
        if(success) {
            // load the maximum transfer value, which can be changed at any point in time
            uint maxTransfer = IKuka(address(activeToken))._maxTxAmount();

            // if the amount of tokens to sweep is greater than the maximum transfer value then only transfer the maximum transfer value
            if(transferAmount > maxTransfer)
                transferAmount = maxTransfer;
        }

        IERC20(activeToken).safeTransfer(destination, transferAmount);

        return (transferAmount);
    }

    function _sweepStakedReflections()
    internal {
        // how many tokens are we pushing to the sweepDestination?
        uint tokensToSweep;

        // load the current amount of tokens held by this contract.
        // ...the actual staked amount is expected to be EQUAL to or LESS than the current token balance due to reflections earned
        uint stakedBalance = stakingToken.balanceOf(address(this));

        // if the difference between the total tokens tracked as staked by this contract and the current balance is greater than zero
        // ...this means that reflections were earned by the contract via staker's deposits
        if(stakedBalance > _totalSupply)
            // set the tokens to sweep to the difference between the tokens held by this contract and the tokens tracked from deposits
            tokensToSweep = stakedBalance.sub(_totalSupply);

        // if the amount of tokens to sweep is greater than zero, initiate transfer. do nothing otherwise.
        if(tokensToSweep > 0)
            // increment the tracker for how many tokens have been earned via reflections by using the return value from the _checkMaxTxAndSafeTransfer() function
            totalReflectionsEarned = totalReflectionsEarned.add(_checkMaxTxAndSafeTransfer(sweepDestination, tokensToSweep, true));
    }

    /* ========== TRUSTLESS MUTATIVE FUNCTIONS ========== */
    // allow contracts to stake for users
    function stakeFor(uint256 originalAmount, address who) external nonReentrant notPaused updateReward(who) sweepTrigger {
        _stakeFor(originalAmount, who, msg.sender);
    }

    // allow contracts to push rewards to users
    function getRewardFor(address who) public nonReentrant updateReward(who) {
        _getRewardFor(who);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(uint256 reward) external onlyRewardsDistribution updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit RewardAdded(reward);
    }

    // End rewards emission earlier
    function updatePeriodFinish(uint timestamp) external onlyOwner updateReward(address(0)) {
        periodFinish = timestamp;
    }

    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        require(tokenAddress != address(stakingToken), "Cannot withdraw the staking token");
        IERC20(tokenAddress).safeTransfer(owner, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    function updateDestination(address _newDestination) external onlyOwner {
        sweepDestination = _newDestination;
    }

    function updateFees(address _flatFeeToken, address _feeDestination, uint _depositFeePercent, uint _flatFee, uint _feeModel)
    external onlyOwner {
        if(_feeModel == 1)
            require(_depositFeePercent <= MAX_PERCENT_FEE, "Forest: Deposit fee too high, must be less than 10%.");

        //if no token was supplied then set it to the staking token
        if(_flatFeeToken == address(0))
            flatFeeToken = address(stakingToken);
        else
            flatFeeToken = _flatFeeToken;

        feeDestination = _feeDestination;
        depositFeePercent = _depositFeePercent;
        flatFee = _flatFee;
        feeModel = _feeModel;
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    modifier sweepTrigger() {
        _;
        // _sweepStakedReflections();
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
}