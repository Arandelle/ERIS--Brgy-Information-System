import { formatDateWithTimeAndWeek, formatTime } from "../../helper/FormatDate";


export const MessageBubble = ({ text, isOwn, timestamp,messageId, prevTimestamp }) => {
  const showOverallTimeStamp =
    !prevTimestamp || timestamp - prevTimestamp > 60 * 1000 * 30; //if  greater than 30 minutes or no prevTimestamp
  const showSpecificTimestamp =
    !prevTimestamp || timestamp - prevTimestamp > 60 * 1000 * 5; // 5 minutes
  return (
    <>
      {showOverallTimeStamp && (
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
            {formatDateWithTimeAndWeek(timestamp)}
          </span>
        </div>
      )}
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 px-4`}
      >
        <div
          className={`flex flex-col max-w-xs lg:max-w-lg text-wrap ${
            isOwn ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl relative ${
              isOwn
                ? "bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-100 rounded-br-sm"
                : "bg-gray-100 dark:bg-gray-200 text-gray-800 rounded-bl-md"
            } shadow-sm`}
          >
            <p className="text-sm leading-relaxed break-words overflow-hidden max-w-lg">
              {text}
            </p>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {showSpecificTimestamp && formatTime(timestamp)}
          </span>
        </div>
      </div>
    </>
  );
};