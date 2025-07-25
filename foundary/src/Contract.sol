// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CompanyCommentVoteV5 {
    struct Company {
        uint id;
        string name;
        string description;
        string location;
        string website;
        address admin;
        uint createdAt;
        bool exists;
        uint totalComments;
        uint totalRating;
    }

    struct Comment {
        uint id;
        address author;
        string content;
        uint createdAt;
        int votes;
        uint upvotes;
        uint downvotes;
        bool hidden;
        uint reportCount;
        uint rating;
        uint companyId;
    }

    uint public companyCount;
    uint public commentCount;

    mapping(string => uint) public companyNameToId;
    mapping(string => uint) public companyDomainToId;
    mapping(uint => Company) public companies;
    mapping(uint => uint[]) public companyComments;
    mapping(uint => Comment) public comments;
    mapping(uint => mapping(address => bool)) public hasVoted;
    mapping(uint => mapping(address => bool)) public hasReported;
    mapping(address => int) public reputation;

    // Thêm mapping lưu các commentId theo address
    mapping(address => uint[]) public userComments;

    event CompanyCreated(uint id, string name, address admin);
    event CommentCreated(
        uint companyId,
        uint commentId,
        address author,
        string content,
        uint rating
    );
    event Voted(uint commentId, address voter, bool isUpvote);
    event CommentReported(uint commentId, address reporter);
    event CommentHidden(uint commentId, address admin);

    // Helper: convert string to lowercase
    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    // Helper: extract domain from website URL
    function _extractDomain(
        string memory website
    ) internal pure returns (string memory) {
        bytes memory b = bytes(website);
        uint start = 0;
        // Skip "http://" or "https://"
        if (b.length > 7 && b[0] == "h" && b[1] == "t" && b[2] == "t") {
            for (uint i = 0; i < b.length - 2; i++) {
                if (b[i] == "/" && b[i + 1] == "/") {
                    start = i + 2;
                    break;
                }
            }
        }
        // Get domain part
        uint end = b.length;
        for (uint i = start; i < b.length; i++) {
            if (b[i] == "/" || b[i] == ":") {
                end = i;
                break;
            }
        }
        bytes memory domain = new bytes(end - start);
        for (uint i = start; i < end; i++) {
            domain[i - start] = b[i];
        }
        return string(domain);
    }

    // Search company by name or website domain (case-insensitive)
    function findCompany(
        string memory keyword
    ) public view returns (uint, string memory, bool) {
        string memory lower = _toLower(keyword);
        uint id = companyNameToId[lower];
        if (id != 0) {
            Company memory c = companies[id];
            return (c.id, c.name, c.exists);
        }
        // If not found by name, try by domain
        id = companyDomainToId[lower];
        if (id != 0) {
            Company memory c = companies[id];
            return (c.id, c.name, c.exists);
        }
        return (0, "", false);
    }

    // Create company if not exists
    function createCompany(
        string memory name,
        string memory description,
        string memory location,
        string memory website
    ) public returns (uint) {
        string memory lowerName = _toLower(name);
        string memory domain = _toLower(_extractDomain(website));
        require(companyNameToId[lowerName] == 0, "Company name exists");
        require(companyDomainToId[domain] == 0, "Company domain exists");
        companyCount++;
        companies[companyCount] = Company(
            companyCount,
            name,
            description,
            location,
            website,
            msg.sender,
            block.timestamp,
            true,
            0,
            0
        );
        companyNameToId[lowerName] = companyCount;
        companyDomainToId[domain] = companyCount;
        emit CompanyCreated(companyCount, name, msg.sender);
        return companyCount;
    }

    // Create comment in a company
    function createComment(
        uint companyId,
        string memory content,
        uint rating
    ) public returns (uint) {
        require(companies[companyId].exists, "Company does not exist");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        commentCount++;
        comments[commentCount] = Comment(
            commentCount,
            msg.sender,
            content,
            block.timestamp,
            0,
            0,
            0,
            false,
            0,
            rating,
            companyId
        );
        companyComments[companyId].push(commentCount);
        // Lưu commentId vào mapping userComments
        userComments[msg.sender].push(commentCount);

        // Cập nhật thống kê của công ty
        companies[companyId].totalComments += 1;
        companies[companyId].totalRating += rating;

        emit CommentCreated(
            companyId,
            commentCount,
            msg.sender,
            content,
            rating
        );
        return commentCount;
    }

    // Vote on a comment
    function vote(uint commentId, bool isUpvote) public {
        require(commentId > 0 && commentId <= commentCount, "Invalid comment");
        require(!hasVoted[commentId][msg.sender], "Already voted");
        Comment storage c = comments[commentId];
        require(!c.hidden, "Comment is hidden");
        hasVoted[commentId][msg.sender] = true;

        if (isUpvote) {
            c.votes += 1;
            c.upvotes += 1;
        } else {
            c.votes -= 1;
            c.downvotes += 1;
        }
        emit Voted(commentId, msg.sender, isUpvote);
    }

    // Report a bad comment
    function reportComment(uint commentId) public {
        require(commentId > 0 && commentId <= commentCount, "Invalid comment");
        require(!hasReported[commentId][msg.sender], "Already reported");
        Comment storage c = comments[commentId];
        require(!c.hidden, "Comment is hidden");
        hasReported[commentId][msg.sender] = true;
        c.reportCount += 1;
        emit CommentReported(commentId, msg.sender);
    }

    // Admin hides a comment
    function hideComment(uint commentId) public {
        Comment storage c = comments[commentId];
        require(!c.hidden, "Already hidden");
        // Find company containing this comment
        uint companyId = 0;
        for (uint i = 1; i <= companyCount; i++) {
            uint[] memory arr = companyComments[i];
            for (uint j = 0; j < arr.length; j++) {
                if (arr[j] == commentId) {
                    companyId = i;
                    break;
                }
            }
            if (companyId != 0) break;
        }
        require(companyId != 0, "Company not found");
        require(
            msg.sender == companies[companyId].admin,
            "Only admin can hide"
        );
        c.hidden = true;
        emit CommentHidden(commentId, msg.sender);
    }

    // Get all comment IDs for a company
    function getCompanyComments(
        uint companyId
    ) public view returns (uint[] memory) {
        return companyComments[companyId];
    }

    // Get comment details
    function getComment(
        uint commentId
    )
        public
        view
        returns (
            uint id,
            address author,
            string memory content,
            uint createdAt,
            int votes,
            uint upvotes,
            uint downvotes,
            bool hidden,
            uint reportCount,
            uint rating,
            uint companyId
        )
    {
        Comment memory c = comments[commentId];
        return (
            c.id,
            c.author,
            c.content,
            c.createdAt,
            c.votes,
            c.upvotes,
            c.downvotes,
            c.hidden,
            c.reportCount,
            c.rating,
            c.companyId
        );
    }

    // Get company details
    function getCompany(
        uint companyId
    )
        public
        view
        returns (
            uint id,
            string memory name,
            string memory description,
            string memory location,
            string memory website,
            address admin,
            uint createdAt,
            bool exists,
            uint totalComments,
            uint totalRating
        )
    {
        Company memory c = companies[companyId];
        return (
            c.id,
            c.name,
            c.description,
            c.location,
            c.website,
            c.admin,
            c.createdAt,
            c.exists,
            c.totalComments,
            c.totalRating
        );
    }

    // Calculate reputation based on comment vote totals
    function calculateReputation(address user) public view returns (int) {
        uint[] memory userCommentIds = userComments[user];
        int totalReputation = 0;

        for (uint i = 0; i < userCommentIds.length; i++) {
            Comment memory comment = comments[userCommentIds[i]];
            if (comment.votes > 0) {
                totalReputation += 1; // Positive votes = +1 reputation
            } else if (comment.votes < 0) {
                totalReputation -= 1; // Negative votes = -1 reputation
            }
            // If votes = 0, no reputation change
        }

        return totalReputation;
    }

    // Get reputation (now calculated dynamically)
    function getReputation(address user) public view returns (int) {
        return calculateReputation(user);
    }

    // Get all companies
    function getAllCompanies() public view returns (Company[] memory) {
        Company[] memory result = new Company[](companyCount);
        for (uint i = 0; i < companyCount; i++) {
            result[i] = companies[i + 1];
        }
        return result;
    }

    // Get all comment details of a company
    function getAllCommentsOfCompany(
        uint companyId
    ) public view returns (Comment[] memory) {
        uint[] memory ids = companyComments[companyId];
        Comment[] memory result = new Comment[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = comments[ids[i]];
        }
        return result;
    }

    // Tính trung bình rating của công ty
    function getAverageRating(uint companyId) public view returns (uint) {
        Company memory c = companies[companyId];
        if (c.totalComments == 0) {
            return 0;
        }
        return c.totalRating / c.totalComments;
    }

    // Lấy thống kê rating của công ty
    function getCompanyRatingStats(
        uint companyId
    )
        public
        view
        returns (uint totalComments, uint totalRating, uint averageRating)
    {
        Company memory c = companies[companyId];
        uint avg = 0;
        if (c.totalComments > 0) {
            avg = c.totalRating / c.totalComments;
        }
        return (c.totalComments, c.totalRating, avg);
    }

    // Lấy tất cả comment của một user theo address
    function getCommentsByUser(
        address user
    ) public view returns (Comment[] memory) {
        uint[] memory ids = userComments[user];
        Comment[] memory result = new Comment[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = comments[ids[i]];
        }
        return result;
    }
}
