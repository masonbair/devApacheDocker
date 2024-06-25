FROM continuumio/miniconda3

# Install Apache and mod_wsgi
RUN apt-get update 
RUN apt-get install -y apache2
#RUN apt-get update 
#RUN apt-get install -y libapache2-mod-wsgi-py3
RUN apt-get update 
RUN apt-get install -y libstdc++6
#RUN apt-get update
RUN apt install -y apache2-dev

ENV BASH_ENV ~/.bashrc
SHELL ["/bin/bash", "-c"]

COPY ./environment.yml /home/env/
RUN conda env create -f /home/env/environment.yml
RUN echo "conda activate pyimagej" >> ~/.bashrc
ENV PATH /opt/conda/envs/pyimagej/bin/python3:$PATH

ENV CONDA_DEFAULT_ENV $(head -1 environment.yml | cut -d' ' -f2)

COPY ./start_apache.sh .
COPY ./configurations/ /etc/apache2/
COPY ./serverFunctionality/ /var/www/html/flask/


# Expose port 80
EXPOSE 80

# Start Apache when the container starts
CMD ["./start_apache.sh"]
RUN a2ensite xpra-flask-apache.conf
RUN a2dissite 000-default.conf