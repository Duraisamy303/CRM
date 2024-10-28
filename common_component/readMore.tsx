import React, { useState } from 'react';

const ReadMore = ({ children, charLimit = 100, readMoreText = 'Read more', readLessText = 'Read less' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    // Truncate content if not expanded
    const displayText = isExpanded ? children : `${children.substring(0, charLimit)}...`;

    return (
        <div>
            <p>{displayText}</p>
            {children?.length > 400 && (
                <button
                    onClick={toggleReadMore}
                    // style={{ color: "grey", cursor: "pointer", fontWeight: "bold" }}
                    className="text-primary underline"
                >
                    {isExpanded ? readLessText : readMoreText}
                </button>
            )}
        </div>
    );
};

export default ReadMore;
