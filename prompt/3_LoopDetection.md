Refactor the loop detection logic in this repository to transition from a 'Hard Halt' to an Adaptive Loop Recovery System with comprehensive Post-Mortem Logging.
Task 1: Implement Adaptive Loop Recovery
Modify the execution loop to implement the following tiered logic:
Detection: Create a tracker that stores the last 5 tool calls (name and arguments).
Tier 1 (Turn 3): If 3 identical calls occur, do NOT halt. Inject a hidden 'Observation' into the context: 'System Note: You are repeating an action. Analyze the failure of previous attempts and pivot your strategy.'
Tier 2 (Turn 4): Increase the temperature parameter (if accessible via the SDK) to 0.8+ to force output variance.
Tier 3 (Turn 5): Force a 'User Intervention' prompt. The agent must stop tool use and output a summary of its struggle to the user.
Tier 4 (Turn 6): Execute a final safety Hard Halt.
Task 2: Automatic Debug Logging (The "Black Box")
Trigger: Whenever a loop is detected (at Tier 1 or higher) OR when a Hard Halt occurs, the system must automatically dump the entire conversation history.
Output: Create a logs/ directory if it doesn't exist. Save the history as a JSON or Markdown file named loop_debug_[TIMESTAMP].json.
Content: The log must include:
The full message history (System, User, and Model turns).
The specific Tool Call that triggered the loop detection.
The internal state of the LoopMonitor (how many repeats were tracked).
Instructions for the refactor:
Identify the current LoopDetected logic and replace it with a LoopMonitor class.
Ensure the logging function does not crash the main thread if there are file permission issues.
Provide a clear explanation of where the logs are being saved in the console output.