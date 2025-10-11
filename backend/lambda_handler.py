from mangum import Mangum
from src.app import app
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

handler = Mangum(app, lifespan="off")


def main(event, context):
    logger.info(f"Lambda event: {event}")
    logger.info(f"Path parameters: {event.get('pathParameters')}")
    logger.info(f"Query parameters: {event.get('queryStringParameters')}")
    logger.info(f"Request path: {event.get('path')}")
    logger.info(f"Stage: {event.get('requestContext', {}).get('stage')}")
    try:
        response = handler(event, context)
        logger.info(f"Lambda response: {response}")
        return response
    except Exception as e:
        logger.error(f"Lambda error: {e}", exc_info=True)
        raise